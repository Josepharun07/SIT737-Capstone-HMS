import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Not } from 'typeorm';
import { Booking, BookingStatus, PaymentStatus } from './entities/booking.entity';
import { Room, RoomStatus } from '../rooms/entities/room.entity';
import { Guest } from '../guests/entities/guest.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CustomLoggerService } from '../../common/logging/logger.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(Guest)
    private guestRepository: Repository<Guest>,
    private logger: CustomLoggerService,
  ) {}

  async create(createBookingDto: CreateBookingDto, userId: string): Promise<Booking> {
    this.logger.log(
      `Creating booking for guest ${createBookingDto.guestId}`,
      'BookingsService',
    );

    // Validate guest exists
    const guest = await this.guestRepository.findOne({
      where: { id: createBookingDto.guestId },
    });
    if (!guest) {
      throw new NotFoundException(`Guest with ID ${createBookingDto.guestId} not found`);
    }

    // Validate room exists
    const room = await this.roomRepository.findOne({
      where: { id: createBookingDto.roomId },
    });
    if (!room) {
      throw new NotFoundException(`Room with ID ${createBookingDto.roomId} not found`);
    }

    // Check room availability
    const isAvailable = await this.checkRoomAvailability(
      createBookingDto.roomId,
      new Date(createBookingDto.checkInDate),
      new Date(createBookingDto.checkOutDate),
    );

    if (!isAvailable) {
      throw new ConflictException(
        `Room ${room.roomNumber} is not available for the selected dates`,
      );
    }

    // Generate confirmation number
    const confirmationNumber = this.generateConfirmationNumber();

    // Create booking
    const booking = this.bookingRepository.create({
      ...createBookingDto,
      confirmationNumber,
      createdBy: userId,
    });

    const savedBooking = await this.bookingRepository.save(booking);

    // Audit log
    this.logger.audit('BOOKING_CREATED', userId, {
      bookingId: savedBooking.id,
      confirmationNumber: savedBooking.confirmationNumber,
      guestName: `${guest.firstName} ${guest.lastName}`,
      roomNumber: room.roomNumber,
      checkInDate: createBookingDto.checkInDate,
      checkOutDate: createBookingDto.checkOutDate,
      totalAmount: createBookingDto.totalAmount,
    });

    this.logger.log(
      `Booking ${savedBooking.id} created successfully`,
      'BookingsService',
    );

    return savedBooking;
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async update(
    id: string,
    updateBookingDto: UpdateBookingDto,
    userId: string,
  ): Promise<Booking> {
    const booking = await this.findOne(id);

    // Store old values for audit
    const oldValues = { ...booking };

    Object.assign(booking, updateBookingDto);
    const updated = await this.bookingRepository.save(booking);

    // Audit log
    this.logger.audit('BOOKING_UPDATED', userId, {
      bookingId: id,
      changes: updateBookingDto,
      oldValues: {
        status: oldValues.status,
        paymentStatus: oldValues.paymentStatus,
      },
    });

    this.logger.log(`Booking ${id} updated`, 'BookingsService');

    return updated;
  }

  async checkIn(id: string, userId: string): Promise<Booking> {
    const booking = await this.findOne(id);

    if (booking.status === BookingStatus.CHECKED_IN) {
      throw new BadRequestException('Guest is already checked in');
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Cannot check in a cancelled booking');
    }

    booking.status = BookingStatus.CHECKED_IN;
    booking.actualCheckInTime = new Date();

    // Update room status to OCCUPIED
    await this.roomRepository.update(booking.roomId, {
      status: RoomStatus.OCCUPIED,
    });

    const updated = await this.bookingRepository.save(booking);

    this.logger.audit('BOOKING_CHECKED_IN', userId, {
      bookingId: id,
      confirmationNumber: booking.confirmationNumber,
      checkInTime: booking.actualCheckInTime,
    });

    return updated;
  }

  async checkOut(id: string, userId: string): Promise<Booking> {
    const booking = await this.findOne(id);

    if (booking.status !== BookingStatus.CHECKED_IN) {
      throw new BadRequestException('Guest must be checked in before checking out');
    }

    booking.status = BookingStatus.CHECKED_OUT;
    booking.actualCheckOutTime = new Date();

    // Update room status to CLEANING
    await this.roomRepository.update(booking.roomId, {
      status: RoomStatus.CLEANING,
    });

    const updated = await this.bookingRepository.save(booking);

    this.logger.audit('BOOKING_CHECKED_OUT', userId, {
      bookingId: id,
      confirmationNumber: booking.confirmationNumber,
      checkOutTime: booking.actualCheckOutTime,
      totalAmount: booking.totalAmount,
      paidAmount: booking.paidAmount,
    });

    return updated;
  }

  async cancel(id: string, userId: string): Promise<Booking> {
    const booking = await this.findOne(id);

    if (booking.status === BookingStatus.CHECKED_OUT) {
      throw new BadRequestException('Cannot cancel a completed booking');
    }

    const oldStatus = booking.status;
    booking.status = BookingStatus.CANCELLED;

    const updated = await this.bookingRepository.save(booking);

    this.logger.audit('BOOKING_CANCELLED', userId, {
      bookingId: id,
      confirmationNumber: booking.confirmationNumber,
      previousStatus: oldStatus,
    });

    return updated;
  }

  async remove(id: string): Promise<void> {
    const booking = await this.findOne(id);
    await this.bookingRepository.remove(booking);
    this.logger.log(`Booking ${id} deleted`, 'BookingsService');
  }

  // Helper Methods
  private async checkRoomAvailability(
    roomId: string,
    checkIn: Date,
    checkOut: Date,
  ): Promise<boolean> {
    const conflictingBookings = await this.bookingRepository.count({
      where: {
        roomId,
        status: Not(BookingStatus.CANCELLED),
        checkInDate: Between(checkIn, checkOut),
      },
    });

    return conflictingBookings === 0;
  }

  private generateConfirmationNumber(): string {
    const prefix = 'BH'; // Blueberry Hills
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  }
}

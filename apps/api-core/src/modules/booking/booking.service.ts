import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Not, IsNull } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Room } from '../room/entities/room.entity';
import { RoomType } from '../room-type/entities/room-type.entity';
import { GuestService } from '../guest/guest.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { BookingStatus } from '../../common/enums/booking-status.enum';
import { PaymentStatus } from '../../common/enums/payment-status.enum';
import { RoomStatus } from '../../common/enums/room-status.enum';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(RoomType)
    private roomTypeRepository: Repository<RoomType>,
    private guestService: GuestService,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    // Validate dates
    const checkIn = new Date(createBookingDto.checkInDate);
    const checkOut = new Date(createBookingDto.checkOutDate);
    
    if (checkOut <= checkIn) {
      throw new BadRequestException('Check-out date must be after check-in date');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (checkIn < today) {
      throw new BadRequestException('Check-in date cannot be in the past');
    }

    // Calculate number of nights
    const numberOfNights = Math.ceil(
      (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Verify guest exists
    await this.guestService.findOne(createBookingDto.guestId);

    // Get room type and calculate pricing
    const roomType = await this.roomTypeRepository.findOne({
      where: { id: createBookingDto.roomTypeId },
    });

    if (!roomType) {
      throw new NotFoundException('Room type not found');
    }

    // Verify max occupancy
    if (createBookingDto.numberOfGuests > roomType.maxOccupancy) {
      throw new BadRequestException(
        `This room type supports maximum ${roomType.maxOccupancy} guests`
      );
    }

    // Calculate amounts
    const roomRate = Number(roomType.basePrice);
    const subtotal = roomRate * numberOfNights;
    const taxAmount = subtotal * 0.12; // 12% GST
    const totalAmount = subtotal + taxAmount;

    // Generate booking number
    const bookingNumber = await this.generateBookingNumber();

    // Create booking
    const booking = this.bookingRepository.create({
      ...createBookingDto,
      bookingNumber,
      numberOfNights,
      roomRate,
      subtotal,
      taxAmount,
      totalAmount,
      checkInDate: checkIn,
      checkOutDate: checkOut,
    });

    return await this.bookingRepository.save(booking);
  }

  async findAll(): Promise<Booking[]> {
    return await this.bookingRepository.find({
      relations: ['guest', 'room', 'roomType'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: BookingStatus): Promise<Booking[]> {
    return await this.bookingRepository.find({
      where: { status },
      relations: ['guest', 'room', 'roomType'],
      order: { checkInDate: 'ASC' },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Booking[]> {
    return await this.bookingRepository.find({
      where: {
        checkInDate: Between(startDate, endDate),
        status: Not(BookingStatus.CANCELLED),
      },
      relations: ['guest', 'room', 'roomType'],
      order: { checkInDate: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['guest', 'room', 'roomType', 'roomType.amenities'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID "${id}" not found`);
    }

    return booking;
  }

  async findByBookingNumber(bookingNumber: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { bookingNumber },
      relations: ['guest', 'room', 'roomType'],
    });

    if (!booking) {
      throw new NotFoundException(`Booking "${bookingNumber}" not found`);
    }

    return booking;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.findOne(id);

    // If updating dates, recalculate
    if (updateBookingDto.checkInDate || updateBookingDto.checkOutDate) {
      const checkIn = new Date(updateBookingDto.checkInDate || booking.checkInDate);
      const checkOut = new Date(updateBookingDto.checkOutDate || booking.checkOutDate);
      
      const numberOfNights = Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
      );

      const subtotal = Number(booking.roomRate) * numberOfNights;
      const taxAmount = subtotal * 0.12;
      const totalAmount = subtotal + taxAmount;

      Object.assign(booking, {
        numberOfNights,
        subtotal,
        taxAmount,
        totalAmount,
      });
    }

    // Update payment status
    if (updateBookingDto.paidAmount !== undefined) {
      booking.paidAmount = updateBookingDto.paidAmount;
      
      if (booking.paidAmount >= Number(booking.totalAmount)) {
        booking.paymentStatus = PaymentStatus.PAID;
      } else if (booking.paidAmount > 0) {
        booking.paymentStatus = PaymentStatus.PARTIAL;
      }
    }

    Object.assign(booking, updateBookingDto);
    return await this.bookingRepository.save(booking);
  }

  async assignRoom(bookingId: string, roomId: string): Promise<Booking> {
    const booking = await this.findOne(bookingId);
    
    // Verify room exists and is available
    const room = await this.roomRepository.findOne({ 
      where: { id: roomId },
      relations: ['roomType'],
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (room.roomTypeId !== booking.roomTypeId) {
      throw new BadRequestException('Room type mismatch');
    }

    // Check if room is available for these dates
    const conflict = await this.checkRoomConflict(
      roomId,
      booking.checkInDate,
      booking.checkOutDate,
      bookingId
    );

    if (conflict) {
      throw new ConflictException('Room is not available for these dates');
    }

    booking.roomId = roomId;
    return await this.bookingRepository.save(booking);
  }

  async checkIn(id: string): Promise<Booking> {
    const booking = await this.findOne(id);

    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException('Only confirmed bookings can be checked in');
    }

    if (!booking.roomId) {
      throw new BadRequestException('Room must be assigned before check-in');
    }

    // Update room status
    await this.roomRepository.update(booking.roomId, {
      status: RoomStatus.OCCUPIED,
    });

    booking.status = BookingStatus.CHECKED_IN;
    booking.checkedInAt = new Date();

    return await this.bookingRepository.save(booking);
  }

  async checkOut(id: string): Promise<Booking> {
    const booking = await this.findOne(id);

    if (booking.status !== BookingStatus.CHECKED_IN) {
      throw new BadRequestException('Only checked-in bookings can be checked out');
    }

    // FIX: Check if room is assigned before updating
    if (booking.roomId) {
      await this.roomRepository.update(booking.roomId, {
        status: RoomStatus.CLEANING,
      });
    }

    // Update guest statistics
    await this.guestService.incrementBookingCount(
      booking.guestId,
      Number(booking.totalAmount)
    );

    booking.status = BookingStatus.CHECKED_OUT;
    booking.checkedOutAt = new Date();

    return await this.bookingRepository.save(booking);
  }

  async cancel(id: string, reason?: string): Promise<Booking> {
    const booking = await this.findOne(id);

    if ([BookingStatus.CHECKED_OUT, BookingStatus.CANCELLED].includes(booking.status)) {
      throw new BadRequestException('This booking cannot be cancelled');
    }

    // If room was assigned, free it up
    if (booking.roomId) {
      await this.roomRepository.update(booking.roomId, {
        status: RoomStatus.AVAILABLE,
      });
    }

    booking.status = BookingStatus.CANCELLED;
    booking.cancelledAt = new Date();
    booking.cancellationReason = reason || null;

    return await this.bookingRepository.save(booking);
  }

  async checkAvailability(dto: CheckAvailabilityDto) {
    const checkIn = new Date(dto.checkInDate);
    const checkOut = new Date(dto.checkOutDate);

    // Get all bookings in this date range
    const conflictingBookings = await this.bookingRepository.find({
      where: {
        status: Not(BookingStatus.CANCELLED),
        roomId: Not(IsNull()),
      },
      relations: ['room'],
    });

    // Filter bookings that overlap
    const overlapping = conflictingBookings.filter(booking => {
      const bookingCheckIn = new Date(booking.checkInDate);
      const bookingCheckOut = new Date(booking.checkOutDate);
      
      return (checkIn < bookingCheckOut && checkOut > bookingCheckIn);
    });

    // Get occupied room IDs
    const occupiedRoomIds = overlapping.map(b => b.roomId).filter(id => id !== null) as string[];

    // Get available rooms
    let query = this.roomRepository.createQueryBuilder('room')
      .leftJoinAndSelect('room.roomType', 'roomType')
      .leftJoinAndSelect('roomType.amenities', 'amenities')
      .where('room.isActive = :isActive', { isActive: true })
      .andWhere('room.status = :status', { status: RoomStatus.AVAILABLE });

    if (occupiedRoomIds.length > 0) {
      query = query.andWhere('room.id NOT IN (:...occupiedRoomIds)', { occupiedRoomIds });
    }

    if (dto.roomTypeId) {
      query = query.andWhere('room.roomTypeId = :roomTypeId', { roomTypeId: dto.roomTypeId });
    }

    const availableRooms = await query.getMany();

    return {
      checkInDate: dto.checkInDate,
      checkOutDate: dto.checkOutDate,
      availableRooms,
      totalAvailable: availableRooms.length,
    };
  }

  private async checkRoomConflict(
    roomId: string,
    checkIn: Date,
    checkOut: Date,
    excludeBookingId?: string,
  ): Promise<boolean> {
    const query = this.bookingRepository.createQueryBuilder('booking')
      .where('booking.roomId = :roomId', { roomId })
      .andWhere('booking.status NOT IN (:...statuses)', {
        statuses: [BookingStatus.CANCELLED, BookingStatus.CHECKED_OUT],
      })
      .andWhere('booking.checkInDate < :checkOut', { checkOut })
      .andWhere('booking.checkOutDate > :checkIn', { checkIn });

    if (excludeBookingId) {
      query.andWhere('booking.id != :excludeBookingId', { excludeBookingId });
    }

    const count = await query.getCount();
    return count > 0;
  }

  private async generateBookingNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Get count of bookings today
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    
    const count = await this.bookingRepository.count({
      where: {
        createdAt: Between(startOfDay, endOfDay),
      },
    });

    const sequence = (count + 1).toString().padStart(4, '0');
    return `BH${year}${month}${day}${sequence}`;
  }
}

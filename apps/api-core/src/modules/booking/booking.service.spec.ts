import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingService } from './booking.service';
import { Booking } from './entities/booking.entity';
import { Room } from '../room/entities/room.entity';
import { RoomType } from '../room-type/entities/room-type.entity';
import { GuestService } from '../guest/guest.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BookingService', () => {
  let service: BookingService;
  let bookingRepository: Repository<Booking>;
  let roomRepository: Repository<Room>;
  let roomTypeRepository: Repository<RoomType>;
  let guestService: GuestService;

  const mockBookingRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    softRemove: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockRoomRepository = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const mockRoomTypeRepository = {
    findOne: jest.fn(),
  };

  const mockGuestService = {
    findOne: jest.fn(),
    incrementBookingCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockBookingRepository,
        },
        {
          provide: getRepositoryToken(Room),
          useValue: mockRoomRepository,
        },
        {
          provide: getRepositoryToken(RoomType),
          useValue: mockRoomTypeRepository,
        },
        {
          provide: GuestService,
          useValue: mockGuestService,
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    bookingRepository = module.get<Repository<Booking>>(getRepositoryToken(Booking));
    roomRepository = module.get<Repository<Room>>(getRepositoryToken(Room));
    roomTypeRepository = module.get<Repository<RoomType>>(getRepositoryToken(RoomType));
    guestService = module.get<GuestService>(GuestService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a booking successfully', async () => {
      const createBookingDto = {
        guestId: 'guest-123',
        roomTypeId: 'room-type-123',
        checkInDate: '2026-03-10',
        checkOutDate: '2026-03-12',
        numberOfGuests: 2,
      };

      const mockGuest = { id: 'guest-123', firstName: 'John', lastName: 'Doe' };
      const mockRoomType = { id: 'room-type-123', basePrice: 5000, maxOccupancy: 2 };
      const mockBooking = {
        id: 'booking-123',
        ...createBookingDto,
        bookingNumber: 'BH2603100001',
        numberOfNights: 2,
        roomRate: 5000,
        subtotal: 10000,
        taxAmount: 1200,
        totalAmount: 11200,
      };

      mockGuestService.findOne.mockResolvedValue(mockGuest);
      mockRoomTypeRepository.findOne.mockResolvedValue(mockRoomType);
      mockBookingRepository.create.mockReturnValue(mockBooking);
      mockBookingRepository.save.mockResolvedValue(mockBooking);
      mockBookingRepository.count.mockResolvedValue(0);

      const result = await service.create(createBookingDto);

      expect(result).toEqual(mockBooking);
      expect(mockGuestService.findOne).toHaveBeenCalledWith('guest-123');
      expect(mockRoomTypeRepository.findOne).toHaveBeenCalled();
      expect(mockBookingRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if checkout date is before checkin', async () => {
      const createBookingDto = {
        guestId: 'guest-123',
        roomTypeId: 'room-type-123',
        checkInDate: '2026-03-12',
        checkOutDate: '2026-03-10',
        numberOfGuests: 2,
      };

      await expect(service.create(createBookingDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if guests exceed max occupancy', async () => {
      const createBookingDto = {
        guestId: 'guest-123',
        roomTypeId: 'room-type-123',
        checkInDate: '2026-03-10',
        checkOutDate: '2026-03-12',
        numberOfGuests: 5,
      };

      const mockGuest = { id: 'guest-123' };
      const mockRoomType = { id: 'room-type-123', maxOccupancy: 2 };

      mockGuestService.findOne.mockResolvedValue(mockGuest);
      mockRoomTypeRepository.findOne.mockResolvedValue(mockRoomType);

      await expect(service.create(createBookingDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should return a booking by id', async () => {
      const mockBooking = { id: 'booking-123', bookingNumber: 'BH2603100001' };
      mockBookingRepository.findOne.mockResolvedValue(mockBooking);

      const result = await service.findOne('booking-123');

      expect(result).toEqual(mockBooking);
      expect(mockBookingRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'booking-123' },
        relations: expect.any(Array),
      });
    });

    it('should throw NotFoundException if booking not found', async () => {
      mockBookingRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });
});

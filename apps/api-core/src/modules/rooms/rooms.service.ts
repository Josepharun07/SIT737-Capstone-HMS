import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room, RoomStatus } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { CustomLoggerService } from '../../common/logging/logger.service';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    private logger: CustomLoggerService,
  ) {}

  async create(createRoomDto: CreateRoomDto, userId: string): Promise<Room> {
    this.logger.log(`Creating room: ${createRoomDto.roomNumber}`, 'RoomsService');

    // Check if room number already exists
    const existing = await this.roomRepository.findOne({
      where: { roomNumber: createRoomDto.roomNumber },
    });

    if (existing) {
      throw new ConflictException(`Room ${createRoomDto.roomNumber} already exists`);
    }

    const room = this.roomRepository.create(createRoomDto);
    const saved = await this.roomRepository.save(room);

    this.logger.audit('ROOM_CREATED', userId, {
      roomId: saved.id,
      roomNumber: saved.roomNumber,
      type: saved.type,
      basePrice: saved.basePrice,
    });

    return saved;
  }

  async findAll(): Promise<Room[]> {
    return this.roomRepository.find({
      where: { isActive: true },
      order: { roomNumber: 'ASC' },
    });
  }

  async findAvailable(): Promise<Room[]> {
    return this.roomRepository.find({
      where: {
        status: RoomStatus.AVAILABLE,
        isActive: true,
      },
      order: { roomNumber: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Room> {
    const room = await this.roomRepository.findOne({ where: { id } });
    if (!room) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }
    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto, userId: string): Promise<Room> {
    const room = await this.findOne(id);
    const oldValues = { ...room };

    Object.assign(room, updateRoomDto);
    const updated = await this.roomRepository.save(room);

    this.logger.audit('ROOM_UPDATED', userId, {
      roomId: id,
      changes: updateRoomDto,
      oldStatus: oldValues.status,
      newStatus: updated.status,
    });

    return updated;
  }

  async updateStatus(id: string, status: RoomStatus, userId: string): Promise<Room> {
    const room = await this.findOne(id);
    const oldStatus = room.status;

    room.status = status;
    const updated = await this.roomRepository.save(room);

    this.logger.audit('ROOM_STATUS_CHANGED', userId, {
      roomId: id,
      roomNumber: room.roomNumber,
      oldStatus,
      newStatus: status,
    });

    this.logger.log(
      `Room ${room.roomNumber} status changed: ${oldStatus} → ${status}`,
      'RoomsService',
    );

    return updated;
  }

  async remove(id: string): Promise<void> {
    const room = await this.findOne(id);
    room.isActive = false;
    await this.roomRepository.save(room);
    this.logger.log(`Room ${id} deactivated`, 'RoomsService');
  }
}

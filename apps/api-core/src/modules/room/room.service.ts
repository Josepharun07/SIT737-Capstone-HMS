import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomStatus } from '../../common/enums/room-status.enum';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const existingRoom = await this.roomRepository.findOne({
      where: { roomNumber: createRoomDto.roomNumber },
      withDeleted: true,
    });

    if (existingRoom && !existingRoom.deletedAt) {
      throw new ConflictException(`Room number "${createRoomDto.roomNumber}" already exists`);
    }

    const room = this.roomRepository.create(createRoomDto);
    return await this.roomRepository.save(room);
  }

  async findAll(): Promise<Room[]> {
    return await this.roomRepository.find({
      relations: ['roomType', 'roomType.amenities'],
      order: { floorNumber: 'ASC', roomNumber: 'ASC' },
    });
  }

  async findByStatus(status: RoomStatus): Promise<Room[]> {
    return await this.roomRepository.find({
      where: { status },
      relations: ['roomType'],
      order: { roomNumber: 'ASC' },
    });
  }

  async findByFloor(floor: number): Promise<Room[]> {
    return await this.roomRepository.find({
      where: { floorNumber: floor },
      relations: ['roomType'],
      order: { roomNumber: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Room> {
    const room = await this.roomRepository.findOne({
      where: { id },
      relations: ['roomType', 'roomType.amenities'],
    });

    if (!room) {
      throw new NotFoundException(`Room with ID "${id}" not found`);
    }

    return room;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room> {
    const room = await this.findOne(id);

    if (updateRoomDto.roomNumber && updateRoomDto.roomNumber !== room.roomNumber) {
      const existing = await this.roomRepository.findOne({
        where: { roomNumber: updateRoomDto.roomNumber },
      });
      if (existing) {
        throw new ConflictException(`Room number "${updateRoomDto.roomNumber}" already exists`);
      }
    }

    Object.assign(room, updateRoomDto);
    return await this.roomRepository.save(room);
  }

  async updateStatus(id: string, status: RoomStatus): Promise<Room> {
    const room = await this.findOne(id);
    room.status = status;
    
    if (status === RoomStatus.AVAILABLE) {
      room.lastInspectedAt = new Date();
    } else if (status === RoomStatus.CLEANING) {
      room.lastCleanedAt = new Date();
    }
    
    return await this.roomRepository.save(room);
  }

  async remove(id: string): Promise<void> {
    const room = await this.findOne(id);
    await this.roomRepository.softRemove(room);
  }

  async getAvailableRoomsCount(): Promise<number> {
    return await this.roomRepository.count({
      where: { status: RoomStatus.AVAILABLE, isActive: true },
    });
  }
}

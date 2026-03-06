import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { RoomType } from './entities/room-type.entity';
import { Amenity } from '../amenity/entities/amenity.entity';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';

@Injectable()
export class RoomTypeService {
  constructor(
    @InjectRepository(RoomType)
    private roomTypeRepository: Repository<RoomType>,
    @InjectRepository(Amenity)
    private amenityRepository: Repository<Amenity>,
  ) {}

  async create(createRoomTypeDto: CreateRoomTypeDto): Promise<RoomType> {
    const { amenityIds, ...roomTypeData } = createRoomTypeDto;
    
    const roomType = this.roomTypeRepository.create(roomTypeData);
    
    if (amenityIds && amenityIds.length > 0) {
      roomType.amenities = await this.amenityRepository.findBy({
        id: In(amenityIds),
      });
    }
    
    return await this.roomTypeRepository.save(roomType);
  }

  async findAll(): Promise<RoomType[]> {
    return await this.roomTypeRepository.find({
      relations: ['amenities'],
      order: { displayOrder: 'ASC', name: 'ASC' },
    });
  }

  async findActive(): Promise<RoomType[]> {
    return await this.roomTypeRepository.find({
      where: { isActive: true },
      relations: ['amenities'],
      order: { displayOrder: 'ASC' },
    });
  }

  async findOne(id: string): Promise<RoomType> {
    const roomType = await this.roomTypeRepository.findOne({
      where: { id },
      relations: ['amenities'],
    });
    
    if (!roomType) {
      throw new NotFoundException(`Room type with ID "${id}" not found`);
    }
    
    return roomType;
  }

  async update(id: string, updateRoomTypeDto: UpdateRoomTypeDto): Promise<RoomType> {
    const { amenityIds, ...roomTypeData } = updateRoomTypeDto;
    
    const roomType = await this.findOne(id);
    Object.assign(roomType, roomTypeData);
    
    if (amenityIds) {
      roomType.amenities = await this.amenityRepository.findBy({
        id: In(amenityIds),
      });
    }
    
    return await this.roomTypeRepository.save(roomType);
  }

  async remove(id: string): Promise<void> {
    const roomType = await this.findOne(id);
    await this.roomTypeRepository.softRemove(roomType);
  }
}

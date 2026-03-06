import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Amenity } from './entities/amenity.entity';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';

@Injectable()
export class AmenityService {
  constructor(
    @InjectRepository(Amenity)
    private amenityRepository: Repository<Amenity>,
  ) {}

  async create(createAmenityDto: CreateAmenityDto): Promise<Amenity> {
    const amenity = this.amenityRepository.create(createAmenityDto);
    return await this.amenityRepository.save(amenity);
  }

  async findAll(): Promise<Amenity[]> {
    return await this.amenityRepository.find({
      order: { displayOrder: 'ASC', name: 'ASC' },
    });
  }

  async findActive(): Promise<Amenity[]> {
    return await this.amenityRepository.find({
      where: { isActive: true },
      order: { displayOrder: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Amenity> {
    const amenity = await this.amenityRepository.findOne({ where: { id } });
    if (!amenity) {
      throw new NotFoundException(`Amenity with ID "${id}" not found`);
    }
    return amenity;
  }

  async update(id: string, updateAmenityDto: UpdateAmenityDto): Promise<Amenity> {
    const amenity = await this.findOne(id);
    Object.assign(amenity, updateAmenityDto);
    return await this.amenityRepository.save(amenity);
  }

  async remove(id: string): Promise<void> {
    const amenity = await this.findOne(id);
    await this.amenityRepository.softRemove(amenity);
  }
}

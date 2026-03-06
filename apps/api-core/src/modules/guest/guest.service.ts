import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Guest } from './entities/guest.entity';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

@Injectable()
export class GuestService {
  constructor(
    @InjectRepository(Guest)
    private guestRepository: Repository<Guest>,
  ) {}

  async create(createGuestDto: CreateGuestDto): Promise<Guest> {
    const guest = this.guestRepository.create(createGuestDto);
    return await this.guestRepository.save(guest);
  }

  async findAll(): Promise<Guest[]> {
    return await this.guestRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async search(query: string): Promise<Guest[]> {
    return await this.guestRepository.find({
      where: [
        { firstName: Like(`%${query}%`) },
        { lastName: Like(`%${query}%`) },
        { email: Like(`%${query}%`) },
        { phoneNumber: Like(`%${query}%`) },
      ],
      take: 20,
    });
  }

  async findByEmail(email: string): Promise<Guest | null> {
    return await this.guestRepository.findOne({ where: { email } });
  }

  async findByPhone(phoneNumber: string): Promise<Guest | null> {
    return await this.guestRepository.findOne({ where: { phoneNumber } });
  }

  async findOne(id: string): Promise<Guest> {
    const guest = await this.guestRepository.findOne({ where: { id } });
    if (!guest) {
      throw new NotFoundException(`Guest with ID "${id}" not found`);
    }
    return guest;
  }

  async update(id: string, updateGuestDto: UpdateGuestDto): Promise<Guest> {
    const guest = await this.findOne(id);
    Object.assign(guest, updateGuestDto);
    return await this.guestRepository.save(guest);
  }

  async remove(id: string): Promise<void> {
    const guest = await this.findOne(id);
    await this.guestRepository.softRemove(guest);
  }

  async incrementBookingCount(id: string, amount: number): Promise<void> {
    await this.guestRepository.increment({ id }, 'totalBookings', 1);
    await this.guestRepository.increment({ id }, 'totalSpent', amount);
  }
}

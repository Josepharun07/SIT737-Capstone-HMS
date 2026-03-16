import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guest } from './entities/guest.entity';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { CustomLoggerService } from '../../common/logging/logger.service';

@Injectable()
export class GuestsService {
  constructor(
    @InjectRepository(Guest)
    private guestRepository: Repository<Guest>,
    private logger: CustomLoggerService,
  ) {}

  async create(createGuestDto: CreateGuestDto, userId: string): Promise<Guest> {
    this.logger.log(
      `Creating guest: ${createGuestDto.firstName} ${createGuestDto.lastName}`,
      'GuestsService',
    );

    const guest = this.guestRepository.create(createGuestDto);
    const saved = await this.guestRepository.save(guest);

    this.logger.audit('GUEST_CREATED', userId, {
      guestId: saved.id,
      name: `${saved.firstName} ${saved.lastName}`,
      email: saved.email,
    });

    return saved;
  }

  async findAll(): Promise<Guest[]> {
    return this.guestRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Guest> {
    const guest = await this.guestRepository.findOne({ where: { id } });
    if (!guest) {
      throw new NotFoundException(`Guest with ID ${id} not found`);
    }
    return guest;
  }

  async update(id: string, updateGuestDto: UpdateGuestDto, userId: string): Promise<Guest> {
    const guest = await this.findOne(id);
    Object.assign(guest, updateGuestDto);
    const updated = await this.guestRepository.save(guest);

    this.logger.audit('GUEST_UPDATED', userId, {
      guestId: id,
      changes: updateGuestDto,
    });

    return updated;
  }

  async remove(id: string): Promise<void> {
    const guest = await this.findOne(id);
    await this.guestRepository.remove(guest);
    this.logger.log(`Guest ${id} deleted`, 'GuestsService');
  }
}

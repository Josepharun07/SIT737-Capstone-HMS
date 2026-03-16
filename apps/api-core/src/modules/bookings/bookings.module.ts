import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './entities/booking.entity';
import { Room } from '../rooms/entities/room.entity';
import { Guest } from '../guests/entities/guest.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Room, Guest]),
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}

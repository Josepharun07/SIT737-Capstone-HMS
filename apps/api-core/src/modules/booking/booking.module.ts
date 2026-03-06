import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Booking } from './entities/booking.entity';
import { Room } from '../room/entities/room.entity';
import { RoomType } from '../room-type/entities/room-type.entity';
import { GuestModule } from '../guest/guest.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Room, RoomType]),
    GuestModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}

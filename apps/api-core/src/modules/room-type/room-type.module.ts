import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomTypeService } from './room-type.service';
import { RoomTypeController } from './room-type.controller';
import { RoomType } from './entities/room-type.entity';
import { AmenityModule } from '../amenity/amenity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomType]),
    AmenityModule,
  ],
  controllers: [RoomTypeController],
  providers: [RoomTypeService],
  exports: [RoomTypeService, TypeOrmModule],
})
export class RoomTypeModule {}

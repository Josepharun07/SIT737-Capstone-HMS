import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmenityService } from './amenity.service';
import { AmenityController } from './amenity.controller';
import { Amenity } from './entities/amenity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Amenity])],
  controllers: [AmenityController],
  providers: [AmenityService],
  exports: [AmenityService, TypeOrmModule],
})
export class AmenityModule {}

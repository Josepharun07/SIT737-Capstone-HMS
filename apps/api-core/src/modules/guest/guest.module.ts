import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestService } from './guest.service';
import { GuestController } from './guest.controller';
import { Guest } from './entities/guest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Guest])],
  controllers: [GuestController],
  providers: [GuestService],
  exports: [GuestService, TypeOrmModule],
})
export class GuestModule {}

import { PartialType } from '@nestjs/swagger';
import { CreateRoomTypeDto } from './create-room-type.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoomTypeDto extends PartialType(CreateRoomTypeDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

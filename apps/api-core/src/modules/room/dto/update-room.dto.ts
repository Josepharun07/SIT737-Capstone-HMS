import { PartialType } from '@nestjs/swagger';
import { CreateRoomDto } from './create-room.dto';
import { IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoomStatus } from '../../../common/enums/room-status.enum';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  @ApiProperty({ enum: RoomStatus, required: false })
  @IsOptional()
  @IsEnum(RoomStatus)
  status?: RoomStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

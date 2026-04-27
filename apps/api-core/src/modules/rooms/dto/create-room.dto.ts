import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsArray,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { RoomType, RoomStatus } from '../entities/room.entity';

export class CreateRoomDto {
  @IsString()
  roomNumber: string;

  @IsNumber()
  @Min(0)
  @Max(20)
  floor: number;

  @IsEnum(RoomType)
  type: RoomType;

  @IsOptional()
  @IsEnum(RoomStatus)
  status?: RoomStatus;

  @IsNumber()
  @Min(0)
  basePrice: number;

  @IsNumber()
  @Min(1)
  @Max(10)
  maxOccupancy: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];

  @IsOptional()
  @IsString()
  viewType?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

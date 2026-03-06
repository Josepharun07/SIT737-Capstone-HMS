import { IsString, IsNumber, IsUUID, IsOptional, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({ example: '101' })
  @IsString()
  @MaxLength(20)
  roomNumber: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(0)
  floorNumber: number;

  @ApiProperty({ example: 'room-type-uuid-here' })
  @IsUUID()
  roomTypeId: string;

  @ApiProperty({ example: 5500, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  customRate?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

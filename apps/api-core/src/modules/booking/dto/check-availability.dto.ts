import { IsDateString, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckAvailabilityDto {
  @ApiProperty({ example: '2026-03-10' })
  @IsDateString()
  checkInDate: string;

  @ApiProperty({ example: '2026-03-12' })
  @IsDateString()
  checkOutDate: string;

  @ApiProperty({ example: 'room-type-uuid', required: false })
  @IsOptional()
  @IsUUID()
  roomTypeId?: string;
}

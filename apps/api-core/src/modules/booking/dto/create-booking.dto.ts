import { IsString, IsUUID, IsDateString, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 'guest-uuid-here' })
  @IsUUID()
  guestId: string;

  @ApiProperty({ example: 'room-type-uuid-here' })
  @IsUUID()
  roomTypeId: string;

  @ApiProperty({ example: '2026-03-10' })
  @IsDateString()
  checkInDate: string;

  @ApiProperty({ example: '2026-03-12' })
  @IsDateString()
  checkOutDate: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  @Max(10)
  numberOfGuests: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  specialRequests?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

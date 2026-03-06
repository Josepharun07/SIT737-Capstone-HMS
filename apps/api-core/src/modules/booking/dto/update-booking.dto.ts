import { PartialType } from '@nestjs/swagger';
import { CreateBookingDto } from './create-booking.dto';
import { IsEnum, IsOptional, IsUUID, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '../../../common/enums/booking-status.enum';
import { PaymentMethod } from '../../../common/enums/payment-method.enum';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  @ApiProperty({ enum: BookingStatus, required: false })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @ApiProperty({ example: 'room-uuid-here', required: false })
  @IsOptional()
  @IsUUID()
  roomId?: string;

  @ApiProperty({ enum: PaymentMethod, required: false })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  @ApiProperty({ example: 5000, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  paidAmount?: number;
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { BookingStatus } from '../../common/enums/booking-status.enum';

@ApiTags('Bookings')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @Post('check-availability')
  @ApiOperation({ summary: 'Check room availability for dates' })
  @ApiResponse({ status: 200, description: 'Returns available rooms' })
  checkAvailability(@Body() dto: CheckAvailabilityDto) {
    return this.bookingService.checkAvailability(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings' })
  @ApiQuery({ name: 'status', enum: BookingStatus, required: false })
  findAll(@Query('status') status?: BookingStatus) {
    if (status) {
      return this.bookingService.findByStatus(status);
    }
    return this.bookingService.findAll();
  }

  @Get('number/:bookingNumber')
  @ApiOperation({ summary: 'Get booking by booking number' })
  findByNumber(@Param('bookingNumber') bookingNumber: string) {
    return this.bookingService.findByBookingNumber(bookingNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update booking' })
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(id, updateBookingDto);
  }

  @Patch(':id/assign-room/:roomId')
  @ApiOperation({ summary: 'Assign room to booking' })
  assignRoom(@Param('id') id: string, @Param('roomId') roomId: string) {
    return this.bookingService.assignRoom(id, roomId);
  }

  @Post(':id/check-in')
  @ApiOperation({ summary: 'Check in a booking' })
  checkIn(@Param('id') id: string) {
    return this.bookingService.checkIn(id);
  }

  @Post(':id/check-out')
  @ApiOperation({ summary: 'Check out a booking' })
  checkOut(@Param('id') id: string) {
    return this.bookingService.checkOut(id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel a booking' })
  cancel(@Param('id') id: string, @Body('reason') reason?: string) {
    return this.bookingService.cancel(id, reason);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete booking (soft delete)' })
  remove(@Param('id') id: string) {
    // Bookings should typically be cancelled, not deleted
    // But keeping for admin purposes
    return this.bookingService.cancel(id, 'Deleted by admin');
  }
}

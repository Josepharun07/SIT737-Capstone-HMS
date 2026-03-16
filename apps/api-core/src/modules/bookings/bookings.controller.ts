import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto, @Request() req) {
    return this.bookingsService.create(createBookingDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @Request() req,
  ) {
    return this.bookingsService.update(id, updateBookingDto, req.user.userId);
  }

  @Post(':id/check-in')
  checkIn(@Param('id') id: string, @Request() req) {
    return this.bookingsService.checkIn(id, req.user.userId);
  }

  @Post(':id/check-out')
  checkOut(@Param('id') id: string, @Request() req) {
    return this.bookingsService.checkOut(id, req.user.userId);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string, @Request() req) {
    return this.bookingsService.cancel(id, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }
}

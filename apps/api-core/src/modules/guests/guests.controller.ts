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
import { GuestsService } from './guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('guests')
@UseGuards(JwtAuthGuard)
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Post()
  create(@Body() createGuestDto: CreateGuestDto, @Request() req) {
    return this.guestsService.create(createGuestDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.guestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.guestsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGuestDto: UpdateGuestDto,
    @Request() req,
  ) {
    return this.guestsService.update(id, updateGuestDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guestsService.remove(id);
  }
}

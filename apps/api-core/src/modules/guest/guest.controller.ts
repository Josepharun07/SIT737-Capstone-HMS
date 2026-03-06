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
import { GuestService } from './guest.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

@ApiTags('Guests')
@Controller('guests')
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new guest' })
  @ApiResponse({ status: 201, description: 'Guest created successfully' })
  create(@Body() createGuestDto: CreateGuestDto) {
    return this.guestService.create(createGuestDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all guests' })
  findAll() {
    return this.guestService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Search guests by name, email, or phone' })
  @ApiQuery({ name: 'q', required: true })
  search(@Query('q') query: string) {
    return this.guestService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get guest by ID' })
  findOne(@Param('id') id: string) {
    return this.guestService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update guest' })
  update(@Param('id') id: string, @Body() updateGuestDto: UpdateGuestDto) {
    return this.guestService.update(id, updateGuestDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete guest (soft delete)' })
  remove(@Param('id') id: string) {
    return this.guestService.remove(id);
  }
}

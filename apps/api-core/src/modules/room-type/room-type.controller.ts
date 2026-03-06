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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoomTypeService } from './room-type.service';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { UpdateRoomTypeDto } from './dto/update-room-type.dto';

@ApiTags('Room Types')
@Controller('room-types')
export class RoomTypeController {
  constructor(private readonly roomTypeService: RoomTypeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new room type' })
  @ApiResponse({ status: 201, description: 'Room type created successfully' })
  create(@Body() createRoomTypeDto: CreateRoomTypeDto) {
    return this.roomTypeService.create(createRoomTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all room types' })
  findAll() {
    return this.roomTypeService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active room types only' })
  findActive() {
    return this.roomTypeService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get room type by ID' })
  findOne(@Param('id') id: string) {
    return this.roomTypeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update room type' })
  update(@Param('id') id: string, @Body() updateRoomTypeDto: UpdateRoomTypeDto) {
    return this.roomTypeService.update(id, updateRoomTypeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete room type (soft delete)' })
  remove(@Param('id') id: string) {
    return this.roomTypeService.remove(id);
  }
}

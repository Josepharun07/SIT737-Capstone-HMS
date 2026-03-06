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
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomStatus } from '../../common/enums/room-status.enum';

@ApiTags('Rooms')
@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new room' })
  @ApiResponse({ status: 201, description: 'Room created successfully' })
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rooms' })
  @ApiQuery({ name: 'status', enum: RoomStatus, required: false })
  @ApiQuery({ name: 'floor', type: Number, required: false })
  findAll(@Query('status') status?: RoomStatus, @Query('floor') floor?: number) {
    if (status) {
      return this.roomService.findByStatus(status);
    }
    if (floor) {
      return this.roomService.findByFloor(+floor);
    }
    return this.roomService.findAll();
  }

  @Get('available-count')
  @ApiOperation({ summary: 'Get count of available rooms' })
  getAvailableCount() {
    return this.roomService.getAvailableRoomsCount();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get room by ID' })
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update room' })
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(id, updateRoomDto);
  }

  @Patch(':id/status/:status')
  @ApiOperation({ summary: 'Update room status' })
  updateStatus(@Param('id') id: string, @Param('status') status: RoomStatus) {
    return this.roomService.updateStatus(id, status);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete room (soft delete)' })
  remove(@Param('id') id: string) {
    return this.roomService.remove(id);
  }
}

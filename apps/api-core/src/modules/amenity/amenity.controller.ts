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
import { AmenityService } from './amenity.service';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';

@ApiTags('Amenities')
@Controller('amenities')
export class AmenityController {
  constructor(private readonly amenityService: AmenityService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new amenity' })
  @ApiResponse({ status: 201, description: 'Amenity created successfully' })
  create(@Body() createAmenityDto: CreateAmenityDto) {
    return this.amenityService.create(createAmenityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all amenities' })
  findAll() {
    return this.amenityService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get active amenities only' })
  findActive() {
    return this.amenityService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get amenity by ID' })
  findOne(@Param('id') id: string) {
    return this.amenityService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update amenity' })
  update(@Param('id') id: string, @Body() updateAmenityDto: UpdateAmenityDto) {
    return this.amenityService.update(id, updateAmenityDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete amenity (soft delete)' })
  remove(@Param('id') id: string) {
    return this.amenityService.remove(id);
  }
}

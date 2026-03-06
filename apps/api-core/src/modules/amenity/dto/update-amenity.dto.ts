import { PartialType } from '@nestjs/swagger';
import { CreateAmenityDto } from './create-amenity.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAmenityDto extends PartialType(CreateAmenityDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

import { IsString, IsNumber, IsEnum, IsBoolean, IsOptional, IsArray, Min, Max, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BedType } from '../../../common/enums/bed-type.enum';
import { ViewType } from '../../../common/enums/view-type.enum';

export class CreateRoomTypeDto {
  @ApiProperty({ example: 'Deluxe Valley View' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'Wake up to stunning valley views', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  tagline?: string;

  @ApiProperty({ example: 'Spacious room with panoramic valley views and modern amenities' })
  @IsString()
  description: string;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @Min(0)
  basePrice: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  @Max(10)
  maxOccupancy: number;

  @ApiProperty({ example: 350, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sizeSqft?: number;

  @ApiProperty({ enum: BedType, example: BedType.KING })
  @IsEnum(BedType)
  bedType: BedType;

  @ApiProperty({ enum: ViewType, example: ViewType.VALLEY, required: false })
  @IsOptional()
  @IsEnum(ViewType)
  viewType?: ViewType;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  hasBalcony?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  hasKitchen?: boolean;

  @ApiProperty({ example: ['amenity-id-1', 'amenity-id-2'], required: false })
  @IsOptional()
  @IsArray()
  amenityIds?: string[];
}

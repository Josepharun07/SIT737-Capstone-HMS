import { IsString, IsBoolean, IsNumber, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAmenityDto {
  @ApiProperty({ example: 'Air Conditioning' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'Climate control for your comfort', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '❄️', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  icon?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isPremium?: boolean;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  displayOrder?: number;
}

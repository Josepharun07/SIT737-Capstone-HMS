import { IsString, IsEmail, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePropertyDto {
  @ApiProperty({ example: 'Blueberry Hills Resort' })
  @IsString()
  @MaxLength(200)
  name: string;

  @ApiProperty({ example: 'Experience Tranquility in Munnar', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  tagline?: string;

  @ApiProperty({ example: 'blueberryhillsmunnar.in' })
  @IsString()
  @MaxLength(100)
  domainUrl: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'Munnar', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'Kerala', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ example: '685612', required: false })
  @IsOptional()
  @IsString()
  pincode?: string;

  @ApiProperty({ example: 'India', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: '+91-XXXXXXXXXX', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'info@blueberryhillsmunnar.in', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;
}

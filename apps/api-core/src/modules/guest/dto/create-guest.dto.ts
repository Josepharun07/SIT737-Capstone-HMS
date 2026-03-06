import { IsString, IsEmail, IsOptional, IsDateString, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGuestDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @MaxLength(100)
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+91-9876543210' })
  @IsString()
  @Matches(/^[+]?[0-9\s-()]+$/, { message: 'Invalid phone number' })
  phoneNumber: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'Mumbai', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'Maharashtra', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ example: '400001', required: false })
  @IsOptional()
  @IsString()
  pincode?: string;

  @ApiProperty({ example: 'India', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: 'Aadhar', required: false })
  @IsOptional()
  @IsString()
  idType?: string;

  @ApiProperty({ example: '1234-5678-9012', required: false })
  @IsOptional()
  @IsString()
  idNumber?: string;

  @ApiProperty({ example: '1990-01-15', required: false })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({ example: 'Indian', required: false })
  @IsOptional()
  @IsString()
  nationality?: string;
}

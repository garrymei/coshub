import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateSkillDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  role!: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({ type: [String], required: false })
  @IsArray()
  @IsOptional()
  images?: string[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  author?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  lat?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  lng?: number;
}

export class QuerySkillsDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  page?: string; // 使用字符串接收，ValidationPipe transform 会转换

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  radius?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  lat?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  lng?: string;
}



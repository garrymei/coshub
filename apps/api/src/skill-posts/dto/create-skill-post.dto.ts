import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEnum,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsObject,
  ValidateNested,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsBoolean,
  Matches
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  SkillCategory,
  SkillRole,
  ExperienceLevel,
  PriceType,
  ContactMethod
} from '@coshub/types';

class PriceDto {
  @IsEnum(PriceType)
  type: PriceType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(99999)
  amount?: number;

  @IsOptional()
  @IsString()
  currency?: string = 'CNY';

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsObject()
  range?: {
    min: number;
    max: number;
  };

  @IsBoolean()
  negotiable: boolean;
}

class TimeSlotDto {
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: '时间格式必须为 HH:mm'
  })
  start: string;

  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: '时间格式必须为 HH:mm'
  })
  end: string;
}

class AvailabilityDto {
  @IsBoolean()
  weekdays: boolean;

  @IsBoolean()
  weekends: boolean;

  @IsBoolean()
  holidays: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  timeSlots: TimeSlotDto[];

  @IsNumber()
  @Min(0)
  @Max(30)
  advance: number;
}

class ContactInfoDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  wechat?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  qq?: string;

  @IsOptional()
  @IsString()
  @MinLength(11)
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  email?: string;

  @IsEnum(ContactMethod)
  preferred: ContactMethod;
}

export class CreateSkillPostDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: '标题至少需要5个字符' })
  @MaxLength(100, { message: '标题不能超过100个字符' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(20, { message: '描述至少需要20个字符' })
  @MaxLength(2000, { message: '描述不能超过2000个字符' })
  description: string;

  @IsEnum(SkillCategory, { message: '请选择有效的技能分类' })
  category: SkillCategory;

  @IsEnum(SkillRole, { message: '请选择有效的角色类型' })
  role: SkillRole;

  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: '城市名称至少需要2个字符' })
  @MaxLength(20, { message: '城市名称不能超过20个字符' })
  city: string;

  @ValidateNested()
  @Type(() => PriceDto)
  price: PriceDto;

  @IsArray()
  @ArrayMinSize(1, { message: '至少需要上传1张图片' })
  @ArrayMaxSize(9, { message: '最多可以上传9张图片' })
  @IsString({ each: true })
  images: string[];

  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10, { message: '最多可以添加10个标签' })
  tags: string[];

  @IsEnum(ExperienceLevel, { message: '请选择有效的经验等级' })
  experience: ExperienceLevel;

  @ValidateNested()
  @Type(() => AvailabilityDto)
  availability: AvailabilityDto;

  @ValidateNested()
  @Type(() => ContactInfoDto)
  contactInfo: ContactInfoDto;
}

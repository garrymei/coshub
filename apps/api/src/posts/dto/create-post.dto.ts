import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEnum,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsBoolean,
  ValidateNested,
  Type,
} from "class-validator";
import { PostType } from "@coshub/types";

export class CreatePostDto {
  @IsEnum(PostType)
  type: PostType;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  @MaxLength(2000)
  content: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(9)
  @IsString({ each: true })
  images: string[];

  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  tags: string[];

  // Skill specific fields
  @IsOptional()
  @ValidateNested()
  @Type(() => PriceDto)
  price?: PriceDto;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  city?: string;

  @IsOptional()
  @IsString()
  role?: string;
}

class PriceDto {
  @IsNumber()
  @Min(0)
  @Max(99999)
  amount: number;

  @IsString()
  currency: string = "CNY";

  @IsBoolean()
  negotiable: boolean;
}
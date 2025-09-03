import { IsString, IsNotEmpty, MinLength, MaxLength } from "class-validator";

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: "评论内容不能为空" })
  @MaxLength(500, { message: "评论内容不能超过500字" })
  content: string;
}
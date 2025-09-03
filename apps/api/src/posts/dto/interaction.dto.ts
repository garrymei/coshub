import { IsString, IsNotEmpty, IsEnum } from "class-validator";
import { InteractionType } from "@coshub/types";

export class CreateInteractionDto {
  @IsEnum(InteractionType)
  type: InteractionType;
}

export class DeleteInteractionDto {
  @IsEnum(InteractionType)
  type: InteractionType;
}
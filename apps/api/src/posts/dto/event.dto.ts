import { IsString, IsNotEmpty, IsEnum } from "class-validator";
import { EventType } from "@coshub/types";

export class TrackEventDto {
  @IsString()
  @IsNotEmpty()
  postId: string;

  @IsEnum(EventType)
  type: EventType;
}

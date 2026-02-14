import { IsString, IsNotEmpty, IsIn } from "class-validator";

export class CreateUploadUrlDto {
  @IsString()
  @IsNotEmpty()
  filename: string;

  @IsString()
  @IsIn(["image/jpeg", "image/png", "image/webp", "video/mp4"])
  contentType: string;
}

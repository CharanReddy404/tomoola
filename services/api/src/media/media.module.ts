import { Module } from "@nestjs/common";
import { MediaService } from "./media.service";
import { MediaController } from "./media.controller";
import { UploadService } from "./upload.service";

@Module({
  providers: [MediaService, UploadService],
  controllers: [MediaController],
})
export class MediaModule {}

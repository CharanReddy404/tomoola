import { Module } from "@nestjs/common";
import { ArtFormsController } from "./art-forms.controller";
import { ArtFormsService } from "./art-forms.service";

@Module({
  controllers: [ArtFormsController],
  providers: [ArtFormsService],
  exports: [ArtFormsService],
})
export class ArtFormsModule {}

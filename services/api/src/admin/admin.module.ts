import { Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { AdminModerationService } from "./admin-moderation.service";
import { AdminModerationController } from "./admin-moderation.controller";

@Module({
  providers: [AdminService, AdminModerationService],
  controllers: [AdminController, AdminModerationController],
})
export class AdminModule {}

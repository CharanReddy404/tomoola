import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard, Roles } from "../auth/roles.guard";
import { AdminModerationService } from "./admin-moderation.service";

@Controller("admin/moderation")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
export class AdminModerationController {
  constructor(private moderationService: AdminModerationService) {}

  @Get()
  getFlaggedContent() {
    return this.moderationService.getFlaggedContent();
  }

  @Patch("media/:id/flag")
  flagMedia(@Param("id") id: string, @Body() body: { reason?: string }) {
    return this.moderationService.flagMedia(id, body.reason);
  }

  @Patch("media/:id/unflag")
  unflagMedia(@Param("id") id: string) {
    return this.moderationService.unflagMedia(id);
  }

  @Patch("media/:id/remove")
  removeMedia(@Param("id") id: string) {
    return this.moderationService.removeMedia(id);
  }

  @Patch("reviews/:id/flag")
  flagReview(@Param("id") id: string, @Body() body: { reason?: string }) {
    return this.moderationService.flagReview(id, body.reason);
  }

  @Patch("reviews/:id/unflag")
  unflagReview(@Param("id") id: string) {
    return this.moderationService.unflagReview(id);
  }

  @Patch("reviews/:id/remove")
  removeReview(@Param("id") id: string) {
    return this.moderationService.removeReview(id);
  }
}

import {
  Controller,
  Post,
  Delete,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  NotFoundException,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard, Roles } from "../auth/roles.guard";
import { CurrentUser } from "../auth/user.decorator";
import { PrismaService } from "../prisma/prisma.service";
import { MediaService } from "./media.service";
import { UploadService } from "./upload.service";
import { CreateUploadUrlDto } from "./dto/create-upload-url.dto";

@Controller("media")
export class MediaController {
  constructor(
    private mediaService: MediaService,
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

  @Post("upload-url")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ARTIST")
  getUploadUrl(
    @Body() dto: CreateUploadUrlDto,
    @CurrentUser() user: { userId: string; role: string },
  ) {
    return this.uploadService.getUploadUrl(
      user.userId,
      dto.filename,
      dto.contentType,
    );
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ARTIST")
  async create(
    @CurrentUser() user: { userId: string; role: string },
    @Body() body: { type: "PHOTO" | "VIDEO_LINK"; url: string; caption?: string },
  ) {
    const profile = await this.prisma.artistProfile.findUnique({
      where: { userId: user.userId },
    });
    if (!profile) {
      throw new NotFoundException("Artist profile not found");
    }
    return this.mediaService.addMedia(profile.id, body);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ARTIST")
  delete(
    @Param("id") id: string,
    @CurrentUser() user: { userId: string; role: string },
  ) {
    return this.mediaService.deleteMedia(id, user.userId);
  }

  @Get("artist/:artistProfileId")
  getByArtist(@Param("artistProfileId") artistProfileId: string) {
    return this.mediaService.getByArtist(artistProfileId);
  }

  @Patch("reorder")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ARTIST")
  async reorder(
    @CurrentUser() user: { userId: string; role: string },
    @Body() body: { mediaIds: string[] },
  ) {
    const profile = await this.prisma.artistProfile.findUnique({
      where: { userId: user.userId },
    });
    if (!profile) {
      throw new NotFoundException("Artist profile not found");
    }
    return this.mediaService.reorder(profile.id, body.mediaIds);
  }
}

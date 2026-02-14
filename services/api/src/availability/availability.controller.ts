import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Query,
  Body,
  UseGuards,
  NotFoundException,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard, Roles } from "../auth/roles.guard";
import { CurrentUser } from "../auth/user.decorator";
import { PrismaService } from "../prisma/prisma.service";
import { AvailabilityService } from "./availability.service";

@Controller("availability")
export class AvailabilityController {
  constructor(
    private availabilityService: AvailabilityService,
    private prisma: PrismaService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ARTIST")
  async blockDates(
    @CurrentUser() user: { userId: string; role: string },
    @Body() body: { dates: string[] },
  ) {
    const profile = await this.prisma.artistProfile.findUnique({
      where: { userId: user.userId },
    });
    if (!profile) {
      throw new NotFoundException("Artist profile not found");
    }
    return this.availabilityService.setBlocked(profile.id, body.dates);
  }

  @Delete()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ARTIST")
  async unblockDates(
    @CurrentUser() user: { userId: string; role: string },
    @Body() body: { dates: string[] },
  ) {
    const profile = await this.prisma.artistProfile.findUnique({
      where: { userId: user.userId },
    });
    if (!profile) {
      throw new NotFoundException("Artist profile not found");
    }
    return this.availabilityService.removeBlocked(profile.id, body.dates);
  }

  @Get(":artistProfileId")
  getByMonth(
    @Param("artistProfileId") artistProfileId: string,
    @Query("year") year: string,
    @Query("month") month: string,
  ) {
    return this.availabilityService.getByMonth(
      artistProfileId,
      parseInt(year, 10),
      parseInt(month, 10),
    );
  }
}

import {
  Controller,
  Post,
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
import { BookingsService } from "./bookings.service";
import { CreateBookingDto } from "./dto/create-booking.dto";

@Controller("bookings")
export class BookingsController {
  constructor(
    private bookingsService: BookingsService,
    private prisma: PrismaService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("CLIENT")
  create(
    @CurrentUser() user: { userId: string; role: string },
    @Body() dto: CreateBookingDto,
  ) {
    return this.bookingsService.create(user.userId, dto);
  }

  @Get("my")
  @UseGuards(JwtAuthGuard)
  findMy(@CurrentUser() user: { userId: string; role: string }) {
    return this.bookingsService.findByClient(user.userId);
  }

  @Get("artist")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ARTIST")
  async findByArtist(@CurrentUser() user: { userId: string; role: string }) {
    const profile = await this.prisma.artistProfile.findUnique({
      where: { userId: user.userId },
    });
    if (!profile) {
      throw new NotFoundException("Artist profile not found");
    }
    return this.bookingsService.findByArtist(profile.id);
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  findById(
    @Param("id") id: string,
    @CurrentUser() user: { userId: string; role: string },
  ) {
    return this.bookingsService.findByIdAuthorized(id, user);
  }

  @Patch(":id/accept")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ARTIST")
  accept(
    @Param("id") id: string,
    @CurrentUser() user: { userId: string; role: string },
  ) {
    return this.bookingsService.accept(id, user.userId);
  }

  @Patch(":id/decline")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ARTIST")
  decline(
    @Param("id") id: string,
    @CurrentUser() user: { userId: string; role: string },
  ) {
    return this.bookingsService.decline(id, user.userId);
  }

  @Patch(":id/complete")
  @UseGuards(JwtAuthGuard)
  complete(
    @Param("id") id: string,
    @CurrentUser() user: { userId: string; role: string },
  ) {
    return this.bookingsService.complete(id, user);
  }

  @Patch(":id/cancel")
  @UseGuards(JwtAuthGuard)
  cancel(
    @Param("id") id: string,
    @CurrentUser() user: { userId: string; role: string },
  ) {
    return this.bookingsService.cancel(id, user);
  }
}

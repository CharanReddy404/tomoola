import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard, Roles } from "../auth/roles.guard";
import { AdminService } from "./admin.service";

@Controller("admin")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get("stats")
  getStats() {
    return this.adminService.getStats();
  }

  @Get("artists/pending")
  getPendingArtists() {
    return this.adminService.getPendingArtists();
  }

  @Patch("artists/:id/approve")
  approveArtist(@Param("id") id: string) {
    return this.adminService.approveArtist(id);
  }

  @Patch("artists/:id/reject")
  rejectArtist(@Param("id") id: string) {
    return this.adminService.rejectArtist(id);
  }

  @Get("bookings")
  getAllBookings(@Query("status") status?: string) {
    return this.adminService.getAllBookings(status ? { status } : undefined);
  }

  @Get("art-forms")
  getAllArtForms() {
    return this.adminService.getAllArtForms();
  }

  @Post("art-forms")
  createArtForm(
    @Body()
    body: {
      name: string;
      slug: string;
      description?: string;
      region?: string;
      category?: string;
    },
  ) {
    return this.adminService.createArtForm(body);
  }

  @Patch("art-forms/:id")
  updateArtForm(
    @Param("id") id: string,
    @Body()
    body: Partial<{
      name: string;
      slug: string;
      description: string;
      region: string;
      category: string;
    }>,
  ) {
    return this.adminService.updateArtForm(id, body);
  }

  @Delete("art-forms/:id")
  deleteArtForm(@Param("id") id: string) {
    return this.adminService.deleteArtForm(id);
  }
}

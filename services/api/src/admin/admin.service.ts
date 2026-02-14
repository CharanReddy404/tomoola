import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { BookingStatus } from "@tomoola/db";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [
      totalUsers,
      totalArtists,
      approvedArtists,
      pendingArtists,
      totalBookings,
      completedBookings,
      totalReviews,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.artistProfile.count(),
      this.prisma.artistProfile.count({ where: { isApproved: true } }),
      this.prisma.artistProfile.count({ where: { isApproved: false } }),
      this.prisma.booking.count(),
      this.prisma.booking.count({ where: { status: "COMPLETED" } }),
      this.prisma.review.count(),
    ]);

    return {
      totalUsers,
      totalArtists,
      approvedArtists,
      pendingArtists,
      totalBookings,
      completedBookings,
      totalReviews,
    };
  }

  async getPendingArtists() {
    return this.prisma.artistProfile.findMany({
      where: {
        OR: [
          { kycStatus: { not: "VERIFIED" } },
          { isApproved: false },
        ],
      },
      include: { user: true },
    });
  }

  async approveArtist(artistProfileId: string) {
    const profile = await this.prisma.artistProfile.findUnique({
      where: { id: artistProfileId },
    });
    if (!profile) {
      throw new NotFoundException("Artist profile not found");
    }

    return this.prisma.artistProfile.update({
      where: { id: artistProfileId },
      data: { isApproved: true },
    });
  }

  async rejectArtist(artistProfileId: string) {
    const profile = await this.prisma.artistProfile.findUnique({
      where: { id: artistProfileId },
    });
    if (!profile) {
      throw new NotFoundException("Artist profile not found");
    }

    return this.prisma.artistProfile.update({
      where: { id: artistProfileId },
      data: { isApproved: false, isActive: false },
    });
  }

  async getAllBookings(filters?: { status?: string }) {
    if (
      filters?.status &&
      !Object.values(BookingStatus).includes(filters.status as BookingStatus)
    ) {
      throw new BadRequestException(`Invalid booking status: ${filters.status}`);
    }

    return this.prisma.booking.findMany({
      where: filters?.status
        ? { status: filters.status as BookingStatus }
        : undefined,
      include: {
        client: true,
        artistProfile: { include: { user: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getAllArtForms() {
    return this.prisma.artForm.findMany({
      orderBy: { name: "asc" },
    });
  }

  async createArtForm(data: {
    name: string;
    slug: string;
    description?: string;
    region?: string;
    category?: string;
  }) {
    return this.prisma.artForm.create({ data });
  }

  async updateArtForm(
    id: string,
    data: Partial<{
      name: string;
      slug: string;
      description: string;
      region: string;
      category: string;
    }>,
  ) {
    const artForm = await this.prisma.artForm.findUnique({ where: { id } });
    if (!artForm) {
      throw new NotFoundException("Art form not found");
    }

    return this.prisma.artForm.update({ where: { id }, data });
  }

  async deleteArtForm(id: string) {
    const artForm = await this.prisma.artForm.findUnique({
      where: { id },
      include: { artists: true },
    });
    if (!artForm) {
      throw new NotFoundException("Art form not found");
    }

    if (artForm.artists.length > 0) {
      throw new BadRequestException(
        "Cannot delete art form with linked artists",
      );
    }

    return this.prisma.artForm.delete({ where: { id } });
  }
}

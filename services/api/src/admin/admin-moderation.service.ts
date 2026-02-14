import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AdminModerationService {
  constructor(private prisma: PrismaService) {}

  async getFlaggedContent() {
    const [media, reviews] = await Promise.all([
      this.prisma.media.findMany({
        where: { flaggedAt: { not: null }, removedAt: null },
        include: { artistProfile: true },
      }),
      this.prisma.review.findMany({
        where: { flaggedAt: { not: null }, removedAt: null },
        include: { client: true, artistProfile: true },
      }),
    ]);

    return { media, reviews };
  }

  async flagMedia(id: string, reason?: string) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) throw new NotFoundException("Media not found");

    return this.prisma.media.update({
      where: { id },
      data: { flaggedAt: new Date(), flagReason: reason },
    });
  }

  async unflagMedia(id: string) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) throw new NotFoundException("Media not found");

    return this.prisma.media.update({
      where: { id },
      data: { flaggedAt: null, flagReason: null },
    });
  }

  async removeMedia(id: string) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) throw new NotFoundException("Media not found");

    return this.prisma.media.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }

  async flagReview(id: string, reason?: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException("Review not found");

    return this.prisma.review.update({
      where: { id },
      data: { flaggedAt: new Date(), flagReason: reason },
    });
  }

  async unflagReview(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException("Review not found");

    return this.prisma.review.update({
      where: { id },
      data: { flaggedAt: null, flagReason: null },
    });
  }

  async removeReview(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException("Review not found");

    return this.prisma.review.update({
      where: { id },
      data: { removedAt: new Date() },
    });
  }
}

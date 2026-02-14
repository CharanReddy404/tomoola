import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateReviewDto } from "./dto/create-review.dto";

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(clientId: string, data: CreateReviewDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: data.bookingId },
      include: { review: true },
    });

    if (!booking) {
      throw new NotFoundException("Booking not found");
    }

    if (booking.clientId !== clientId) {
      throw new ForbiddenException("This booking does not belong to you");
    }

    if (booking.status !== "COMPLETED") {
      throw new BadRequestException(
        "You can only review completed bookings",
      );
    }

    if (booking.review) {
      throw new BadRequestException(
        "A review already exists for this booking",
      );
    }

    return this.prisma.review.create({
      data: {
        bookingId: data.bookingId,
        clientId,
        artistProfileId: booking.artistProfileId,
        rating: data.rating,
        comment: data.comment,
      },
    });
  }

  async findByArtist(artistProfileId: string) {
    return this.prisma.review.findMany({
      where: { artistProfileId, removedAt: null },
      include: {
        client: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}

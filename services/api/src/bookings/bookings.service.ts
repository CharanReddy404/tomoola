import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AvailabilityService } from "../availability/availability.service";
import { NotificationsService } from "../notifications/notifications.service";
import { CreateBookingDto } from "./dto/create-booking.dto";

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    private prisma: PrismaService,
    private availabilityService: AvailabilityService,
    private notificationsService: NotificationsService,
  ) {}

  async create(clientId: string, data: CreateBookingDto) {
    const eventDate = new Date(data.eventDate);

    const blocked = await this.prisma.availability.findUnique({
      where: {
        artistProfileId_date: {
          artistProfileId: data.artistProfileId,
          date: eventDate,
        },
      },
    });

    if (blocked?.isBlocked) {
      throw new BadRequestException(
        "Artist is not available on the selected date",
      );
    }

    const booking = await this.prisma.booking.create({
      data: {
        clientId,
        artistProfileId: data.artistProfileId,
        eventDate,
        eventTime: data.eventTime,
        eventType: data.eventType,
        eventLocation: data.eventLocation,
        venueAddress: data.venueAddress,
        duration: data.duration,
        message: data.message,
        status: "REQUESTED",
      },
    });

    const artist = await this.prisma.artistProfile.findUnique({
      where: { id: data.artistProfileId },
      include: { user: true },
    });
    if (artist) {
      this.notificationsService.notifyArtistNewBooking({
        artistPhone: artist.user.phone,
        artistEmail: artist.user.email || undefined,
        artistName: artist.groupName,
        clientName: "Client",
        eventType: data.eventType,
        eventDate: data.eventDate,
        eventLocation: data.eventLocation,
      });
    }

    return booking;
  }

  async findById(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        client: true,
        artistProfile: { include: { user: true } },
        review: true,
      },
    });

    if (!booking) {
      throw new NotFoundException("Booking not found");
    }

    return booking;
  }

  async findByIdAuthorized(id: string, user: { userId: string; role: string }) {
    const booking = await this.findById(id);

    if (
      user.role !== "ADMIN" &&
      booking.clientId !== user.userId &&
      booking.artistProfile.userId !== user.userId
    ) {
      throw new ForbiddenException("You do not have access to this booking");
    }

    return booking;
  }

  async findByClient(clientId: string) {
    return this.prisma.booking.findMany({
      where: { clientId },
      include: {
        artistProfile: { include: { user: true } },
        review: true,
      },
      orderBy: { eventDate: "desc" },
    });
  }

  async findByArtist(artistProfileId: string) {
    return this.prisma.booking.findMany({
      where: { artistProfileId },
      include: {
        client: true,
        review: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async accept(bookingId: string, artistUserId: string) {
    const booking = await this.findById(bookingId);
    if (booking.artistProfile.userId !== artistUserId) {
      throw new ForbiddenException("You do not own this booking");
    }

    if (booking.status !== "REQUESTED") {
      throw new BadRequestException(
        "Booking can only be accepted when in REQUESTED status",
      );
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: "ACCEPTED" },
    });

    await this.availabilityService.setBlocked(booking.artistProfileId, [
      booking.eventDate.toISOString().split("T")[0],
    ]);

    const fullBooking = await this.findById(bookingId);
    this.notificationsService.notifyClientBookingStatus({
      clientPhone: fullBooking.client.phone,
      clientEmail: fullBooking.client.email || undefined,
      clientName: fullBooking.client.name,
      artistName: fullBooking.artistProfile.groupName || "Artist",
      status: "ACCEPTED",
      eventDate: fullBooking.eventDate.toISOString().split("T")[0],
    });

    return updated;
  }

  async decline(bookingId: string, artistUserId: string) {
    const booking = await this.findById(bookingId);
    if (booking.artistProfile.userId !== artistUserId) {
      throw new ForbiddenException("You do not own this booking");
    }

    if (booking.status !== "REQUESTED") {
      throw new BadRequestException(
        "Booking can only be declined when in REQUESTED status",
      );
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: "DECLINED" },
    });

    const fullBooking = await this.findById(bookingId);
    this.notificationsService.notifyClientBookingStatus({
      clientPhone: fullBooking.client.phone,
      clientEmail: fullBooking.client.email || undefined,
      clientName: fullBooking.client.name,
      artistName: fullBooking.artistProfile.groupName || "Artist",
      status: "DECLINED",
      eventDate: fullBooking.eventDate.toISOString().split("T")[0],
    });

    return updated;
  }

  async complete(
    bookingId: string,
    user: { userId: string; role: string },
  ) {
    const booking = await this.findById(bookingId);

    if (
      user.role !== "ADMIN" &&
      booking.artistProfile.userId !== user.userId
    ) {
      throw new ForbiddenException("Only the artist or an admin can complete a booking");
    }

    if (booking.status !== "ACCEPTED") {
      throw new BadRequestException(
        "Booking can only be completed when in ACCEPTED status",
      );
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: "COMPLETED", completedAt: new Date() },
    });
  }

  async cancel(
    bookingId: string,
    user: { userId: string; role: string },
  ) {
    const booking = await this.findById(bookingId);

    if (
      user.role !== "ADMIN" &&
      booking.clientId !== user.userId &&
      booking.artistProfile.userId !== user.userId
    ) {
      throw new ForbiddenException("You do not have permission to cancel this booking");
    }

    if (booking.status !== "REQUESTED" && booking.status !== "ACCEPTED") {
      throw new BadRequestException(
        "Booking can only be cancelled when in REQUESTED or ACCEPTED status",
      );
    }

    if (booking.status === "ACCEPTED") {
      await this.availabilityService.removeBlocked(booking.artistProfileId, [
        booking.eventDate.toISOString().split("T")[0],
      ]);
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED", cancelledAt: new Date() },
    });
  }
}

import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  async setBlocked(artistProfileId: string, dates: string[]) {
    const operations = dates.map((dateStr) => {
      const date = new Date(dateStr);
      return this.prisma.availability.upsert({
        where: { artistProfileId_date: { artistProfileId, date } },
        update: { isBlocked: true },
        create: { artistProfileId, date, isBlocked: true },
      });
    });

    return Promise.all(operations);
  }

  async removeBlocked(artistProfileId: string, dates: string[]) {
    const operations = dates.map((dateStr) => {
      const date = new Date(dateStr);
      return this.prisma.availability.deleteMany({
        where: { artistProfileId, date, isBlocked: true },
      });
    });

    return Promise.all(operations);
  }

  async getByMonth(artistProfileId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const [availability, bookings] = await Promise.all([
      this.prisma.availability.findMany({
        where: {
          artistProfileId,
          date: { gte: startDate, lt: endDate },
        },
      }),
      this.prisma.booking.findMany({
        where: {
          artistProfileId,
          eventDate: { gte: startDate, lt: endDate },
          status: { in: ["ACCEPTED", "REQUESTED"] },
        },
        select: { eventDate: true, status: true },
      }),
    ]);

    return { availability, bookings };
  }
}

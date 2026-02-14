import { Module } from "@nestjs/common";
import { AvailabilityModule } from "../availability/availability.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { BookingsService } from "./bookings.service";
import { BookingsController } from "./bookings.controller";

@Module({
  imports: [AvailabilityModule, NotificationsModule],
  providers: [BookingsService],
  controllers: [BookingsController],
})
export class BookingsModule {}

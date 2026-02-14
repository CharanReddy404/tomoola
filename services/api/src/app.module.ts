import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HealthController } from "./health.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { ArtistsModule } from "./artists/artists.module";
import { ArtFormsModule } from "./art-forms/art-forms.module";
import { BookingsModule } from "./bookings/bookings.module";
import { AvailabilityModule } from "./availability/availability.module";
import { ReviewsModule } from "./reviews/reviews.module";
import { MediaModule } from "./media/media.module";
import { AdminModule } from "./admin/admin.module";
import { NotificationsModule } from "./notifications/notifications.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
    PrismaModule,
    AuthModule,
    ArtistsModule,
    ArtFormsModule,
    BookingsModule,
    AvailabilityModule,
    ReviewsModule,
    MediaModule,
    AdminModule,
    NotificationsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}

import { Injectable, UnauthorizedException, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { randomInt } from "crypto";
import { PrismaService } from "../prisma/prisma.service";
import { RedisService } from "../redis/redis.service";
import { UserRole } from "@tomoola/db";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly OTP_EXPIRY_SECONDS = 300; // 5 minutes

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly redis: RedisService,
  ) {}

  async sendOtp(phone: string): Promise<{ success: boolean; message: string }> {
    const otp = randomInt(100000, 999999).toString();

    await this.redis.setWithExpiry(
      `otp:${phone}`,
      otp,
      this.OTP_EXPIRY_SECONDS,
    );

    if (process.env.NODE_ENV !== "production") {
      this.logger.log(`[DEV] OTP for ${phone}: ${otp}`);
    }

    return { success: true, message: "OTP sent" };
  }

  async verifyOtp(
    phone: string,
    otp: string,
    role?: "CLIENT" | "ARTIST" | "ADMIN",
  ): Promise<{ token: string; user: Record<string, unknown> }> {
    const storedOtp = await this.redis.getAndDelete(`otp:${phone}`);

    if (!storedOtp || storedOtp !== otp) {
      throw new UnauthorizedException("Invalid or expired OTP");
    }

    let user = await this.prisma.user.findUnique({ where: { phone } });

    if (!user) {
      if (role === "ADMIN") {
        throw new UnauthorizedException(
          "Admin accounts cannot be created via OTP",
        );
      }

      user = await this.prisma.user.create({
        data: {
          phone,
          name: "",
          role: (role as UserRole) ?? UserRole.CLIENT,
        },
      });
    }

    const token = this.jwt.sign({ sub: user.id, role: user.role });

    return { token, user };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { artistProfile: true },
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return user;
  }
}

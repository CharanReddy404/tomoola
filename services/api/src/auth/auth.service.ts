import { Injectable, UnauthorizedException, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { UserRole } from "@tomoola/db";

interface OtpEntry {
  otp: string;
  expiresAt: Date;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly otpStore = new Map<string, OtpEntry>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async sendOtp(phone: string): Promise<{ success: boolean; message: string }> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    this.otpStore.set(phone, { otp, expiresAt });
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
    const entry = this.otpStore.get(phone);

    if (!entry || entry.otp !== otp || entry.expiresAt < new Date()) {
      throw new UnauthorizedException("Invalid or expired OTP");
    }

    this.otpStore.delete(phone);

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

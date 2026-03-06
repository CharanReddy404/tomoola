import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from "@nestjs/common";
import { Throttle } from "@nestjs/throttler";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { SendOtpDto } from "./dto/send-otp.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 requests per minute
  @Post("send-otp")
  sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto.phone);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @Post("verify-otp")
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto.phone, dto.otp, dto.role);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  getMe(@Request() req: { user: { userId: string } }) {
    return this.authService.getMe(req.user.userId);
  }
}

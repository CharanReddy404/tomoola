import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import * as nodemailer from "nodemailer";

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  private transporter: nodemailer.Transporter;

  constructor(
    private config: ConfigService,
    private http: HttpService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>("SMTP_HOST"),
      port: this.config.get<number>("SMTP_PORT"),
      auth: {
        user: this.config.get<string>("SMTP_USER"),
        pass: this.config.get<string>("SMTP_PASS"),
      },
    });
  }

  async notifyArtistNewBooking(params: {
    artistPhone: string;
    artistEmail?: string;
    artistName: string;
    clientName: string;
    eventType: string;
    eventDate: string;
    eventLocation: string;
  }): Promise<void> {
    try {
      const message =
        `Hi ${params.artistName}, you have a new booking request from ${params.clientName}! ` +
        `Event: ${params.eventType} on ${params.eventDate} at ${params.eventLocation}. ` +
        `Log in to ToMoola to respond.`;

      if (this.isWhatsAppEnabled()) {
        await this.sendWhatsApp(params.artistPhone, message);
        return;
      }

      if (this.isEmailEnabled() && params.artistEmail) {
        await this.sendEmail(
          params.artistEmail,
          "New Booking Request - ToMoola",
          `<p>${message}</p>`,
        );
      }
    } catch (error) {
      this.logger.warn(
        `Failed to notify artist about new booking: ${error}`,
      );
    }
  }

  async notifyClientBookingStatus(params: {
    clientPhone: string;
    clientEmail?: string;
    clientName: string;
    artistName: string;
    status: string;
    eventDate: string;
  }): Promise<void> {
    try {
      const message =
        `Hi ${params.clientName}, your booking with ${params.artistName} ` +
        `on ${params.eventDate} has been ${params.status.toLowerCase()}. ` +
        `Log in to ToMoola for details.`;

      if (this.isWhatsAppEnabled()) {
        await this.sendWhatsApp(params.clientPhone, message);
        return;
      }

      if (this.isEmailEnabled() && params.clientEmail) {
        await this.sendEmail(
          params.clientEmail,
          `Booking ${params.status} - ToMoola`,
          `<p>${message}</p>`,
        );
      }
    } catch (error) {
      this.logger.warn(
        `Failed to notify client about booking status: ${error}`,
      );
    }
  }

  private async sendWhatsApp(to: string, message: string): Promise<void> {
    const phoneNumberId = this.config.get<string>("WHATSAPP_PHONE_NUMBER_ID");
    const accessToken = this.config.get<string>("WHATSAPP_ACCESS_TOKEN");
    const apiVersion =
      this.config.get<string>("WHATSAPP_API_VERSION") || "v20.0";

    const url = `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`;

    await firstValueFrom(
      this.http.post(
        url,
        {
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body: message },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      ),
    );

    this.logger.log(`WhatsApp message sent to ${to}`);
  }

  private async sendEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: this.config.get<string>("EMAIL_FROM"),
      to,
      subject,
      html,
    });

    this.logger.log(`Email sent to ${to}`);
  }

  private isWhatsAppEnabled(): boolean {
    return this.config.get<string>("WHATSAPP_ENABLED") === "true";
  }

  private isEmailEnabled(): boolean {
    return this.config.get<string>("EMAIL_ENABLED") === "true";
  }
}

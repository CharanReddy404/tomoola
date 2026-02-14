import { Injectable, BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
];

@Injectable()
export class UploadService {
  private client: S3Client | null = null;
  private bucket: string;
  private publicUrl: string;

  constructor(private config: ConfigService) {
    const accountId = this.config.get<string>("R2_ACCOUNT_ID");
    const accessKey = this.config.get<string>("R2_ACCESS_KEY");
    const secretKey = this.config.get<string>("R2_SECRET_KEY");
    this.bucket = this.config.get<string>("R2_BUCKET", "tomoola-media");
    this.publicUrl = this.config.get<string>("R2_PUBLIC_URL", "");

    if (accountId && accessKey && secretKey) {
      this.client = new S3Client({
        region: "auto",
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: accessKey,
          secretAccessKey: secretKey,
        },
      });
    }
  }

  async getUploadUrl(userId: string, filename: string, contentType: string) {
    if (!this.client) {
      throw new BadRequestException("File upload is not configured");
    }

    if (!ALLOWED_TYPES.includes(contentType)) {
      throw new BadRequestException(
        `Content type ${contentType} is not allowed`,
      );
    }

    const ext = filename.split(".").pop() || "bin";
    const key = `media/${userId}/${uuidv4()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.client, command, {
      expiresIn: 300,
    });

    const publicUrl = this.publicUrl
      ? `${this.publicUrl.replace(/\/$/, "")}/${key}`
      : uploadUrl.split("?")[0];

    return { uploadUrl, publicUrl, key };
  }
}

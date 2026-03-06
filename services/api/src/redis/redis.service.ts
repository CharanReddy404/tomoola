import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const redisUrl = this.configService.get<string>("REDIS_URL");
    const redisHost = this.configService.get<string>("REDIS_HOST", "localhost");
    const redisPort = this.configService.get<number>("REDIS_PORT", 6379);

    this.client = redisUrl
      ? new Redis(redisUrl, {
          maxRetriesPerRequest: 3,
          retryStrategy: (times: number) => {
            if (times > 3) {
              this.logger.error("Redis connection failed after 3 retries");
              return null;
            }
            return Math.min(times * 200, 1000);
          },
        })
      : new Redis({
          host: redisHost,
          port: redisPort,
          maxRetriesPerRequest: 3,
          retryStrategy: (times: number) => {
            if (times > 3) {
              this.logger.error("Redis connection failed after 3 retries");
              return null;
            }
            return Math.min(times * 200, 1000);
          },
        });

    this.client.on("connect", () => {
      this.logger.log("Redis connected successfully");
    });

    this.client.on("error", (error) => {
      this.logger.error(`Redis connection error: ${error.message}`);
    });
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async setWithExpiry(key: string, value: string, expirySeconds: number): Promise<void> {
    await this.client.setex(key, expirySeconds, value);
  }

  async getAndDelete(key: string): Promise<string | null> {
    const value = await this.client.get(key);
    if (value) {
      await this.client.del(key);
    }
    return value;
  }

  get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string): Promise<"OK"> {
    return this.client.set(key, value);
  }

  async del(key: string): Promise<number> {
    return this.client.del(key);
  }

  async ping(): Promise<string> {
    return this.client.ping();
  }
}

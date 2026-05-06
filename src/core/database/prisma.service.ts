import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const databaseUrl = process.env.DATABASE_URL?.trim();
    if (!databaseUrl) {
      throw new Error(
        'Missing DATABASE_URL environment variable required for PrismaPg adapter.',
      );
    }

    super({
      adapter: new PrismaPg(databaseUrl),
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected!!');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

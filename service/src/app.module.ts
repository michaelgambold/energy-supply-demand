import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { FuelSeeder } from './seeders/FuelSeeder';
import { RegionSeeder } from './seeders/RegionSeeder';
import { DataScraperModule } from './data-scraper/data-scraper.module';
import { DataModule } from './data/data.module';
import { FuelModule } from './fuel/fuel.module';
import { RegionModule } from './region/region.module';
import { PowerModule } from './power/power.module';
import { PowerSeeder } from './seeders/PowerSeeder';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'web', 'dist'),
    }),
    ConfigModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          redis: {
            host: config.get('REDIS_HOST'),
            port: config.get('REDIS_PORT'),
          },
        };
      },
    }),
    BullModule.registerQueue({
      name: 'new-data',
    }),
    MikroOrmModule.forRoot(),
    ScheduleModule.forRoot(),
    DataScraperModule,
    DataModule,
    FuelModule,
    RegionModule,
    PowerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    await this.orm.getMigrator().up();
    await this.orm.getSeeder().seed(FuelSeeder, RegionSeeder, PowerSeeder);
  }
}

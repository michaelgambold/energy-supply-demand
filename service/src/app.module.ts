import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FuelSeeder } from './seeders/FuelSeeder';
import { RegionSeeder } from './seeders/RegionSeeder';
import { DataScraperModule } from './data-scraper/data-scraper.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DataModule } from './data/data.module';
import { FuelModule } from './fuel/fuel.module';
import { RegionModule } from './region/region.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'web', 'dist'),
    }),
    ConfigModule.forRoot(),
    MikroOrmModule.forRoot(),
    ScheduleModule.forRoot(),
    DataScraperModule,
    DataModule,
    FuelModule,
    RegionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    await this.orm.getMigrator().up();
    await this.orm.getSeeder().seed(FuelSeeder, RegionSeeder);
  }
}

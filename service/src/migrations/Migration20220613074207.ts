import { Migration } from '@mikro-orm/migrations';

export class Migration20220613074207 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "data_fact" drop constraint "data_fact_region_id_foreign";');

    this.addSql('alter table "data_fact" drop constraint "data_fact_power_id_foreign";');

    this.addSql('alter table "data_fact" drop constraint "data_fact_fuel_id_foreign";');

    this.addSql('create table "time" ("id" serial primary key, "time" time(0) not null, "quater_of_day" int not null, "half_of_day" int not null, "hour" int not null, "quater_of_hour" int not null, "twelfth_of_hour" int not null, "minute" int not null);');

    this.addSql('create table "region_dimension" ("id" serial primary key, "name" varchar(255) not null, "abbreviation" varchar(255) not null, "ref" varchar(255) not null, "timezone" varchar(255) not null);');

    this.addSql('create table "power_dimension" ("id" serial primary key, "name" varchar(255) not null, "ref" varchar(255) not null, "type" varchar(255) not null);');

    this.addSql('create table "fuel_dimension" ("id" serial primary key, "name" varchar(255) not null, "ref" varchar(255) not null, "type" varchar(255) not null);');

    this.addSql('create table "date_dimension" ("id" serial primary key, "date" date not null, "year" int not null, "quater" int not null, "month_number" int not null, "day_of_month" int not null, "day_of_week" int not null, "day_name" varchar(255) not null);');

    this.addSql('drop table if exists "region" cascade;');

    this.addSql('drop table if exists "power" cascade;');

    this.addSql('drop table if exists "fuel" cascade;');

    this.addSql('alter table "data_fact" drop constraint "data_fact_fuel_id_foreign";');
    this.addSql('alter table "data_fact" drop constraint "data_fact_region_id_foreign";');
    this.addSql('alter table "data_fact" drop constraint "data_fact_power_id_foreign";');

    this.addSql('alter table "data_fact" add constraint "data_fact_fuel_id_foreign" foreign key ("fuel_id") references "fuel_dimension" ("id") on update cascade;');
    this.addSql('alter table "data_fact" add constraint "data_fact_region_id_foreign" foreign key ("region_id") references "region_dimension" ("id") on update cascade;');
    this.addSql('alter table "data_fact" add constraint "data_fact_power_id_foreign" foreign key ("power_id") references "power_dimension" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "data_fact" drop constraint "data_fact_region_id_foreign";');

    this.addSql('alter table "data_fact" drop constraint "data_fact_power_id_foreign";');

    this.addSql('alter table "data_fact" drop constraint "data_fact_fuel_id_foreign";');

    this.addSql('create table "region" ("id" serial primary key, "name" varchar(255) not null, "abbreviation" varchar(255) not null, "ref" varchar(255) not null, "timezone" varchar(255) not null);');

    this.addSql('create table "power" ("id" serial primary key, "name" varchar(255) not null, "ref" varchar(255) not null, "type" varchar(255) not null);');

    this.addSql('create table "fuel" ("id" serial primary key, "name" varchar(255) not null, "ref" varchar(255) not null, "type" varchar(255) not null);');

    this.addSql('drop table if exists "time" cascade;');

    this.addSql('drop table if exists "region_dimension" cascade;');

    this.addSql('drop table if exists "power_dimension" cascade;');

    this.addSql('drop table if exists "fuel_dimension" cascade;');

    this.addSql('drop table if exists "date_dimension" cascade;');

    this.addSql('alter table "data_fact" drop constraint "data_fact_fuel_id_foreign";');
    this.addSql('alter table "data_fact" drop constraint "data_fact_region_id_foreign";');
    this.addSql('alter table "data_fact" drop constraint "data_fact_power_id_foreign";');

    this.addSql('alter table "data_fact" add constraint "data_fact_fuel_id_foreign" foreign key ("fuel_id") references "fuel" ("id") on update cascade;');
    this.addSql('alter table "data_fact" add constraint "data_fact_region_id_foreign" foreign key ("region_id") references "region" ("id") on update cascade;');
    this.addSql('alter table "data_fact" add constraint "data_fact_power_id_foreign" foreign key ("power_id") references "power" ("id") on update cascade;');
  }

}

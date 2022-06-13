import { Migration } from '@mikro-orm/migrations';

export class Migration20220613080552 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "time_dimension" ("id" serial primary key, "time" time(0) not null, "quater_of_day" int not null, "half_of_day" int not null, "hour" int not null, "quater_of_hour" int not null, "twelfth_of_hour" int not null, "minute" int not null);');

    this.addSql('create table "region_dimension" ("id" serial primary key, "name" varchar(255) not null, "abbreviation" varchar(255) not null, "ref" varchar(255) not null, "timezone" varchar(255) not null);');

    this.addSql('create table "power_dimension" ("id" serial primary key, "name" varchar(255) not null, "ref" varchar(255) not null, "type" varchar(255) not null);');

    this.addSql('create table "fuel_dimension" ("id" serial primary key, "name" varchar(255) not null, "ref" varchar(255) not null, "type" varchar(255) not null);');

    this.addSql('create table "date_dimension" ("id" serial primary key, "date" date not null, "year" int not null, "quater" int not null, "month_number" int not null, "day_of_month" int not null, "day_of_week" int not null, "day_name" varchar(255) not null);');

    this.addSql('create table "data_fact" ("uuid" varchar(255) not null, "timestamp" timestamptz(0) not null, "value" int not null, "fuel_id" int not null, "region_id" int not null, "power_id" int not null);');
    this.addSql('create index "timestamp_index" on "data_fact" ("timestamp");');
    this.addSql('create index "fuel_index" on "data_fact" ("fuel_id");');
    this.addSql('create index "region_index" on "data_fact" ("region_id");');
    this.addSql('create index "power_index" on "data_fact" ("power_id");');
    this.addSql('alter table "data_fact" add constraint "data_fact_pkey" primary key ("uuid");');

    this.addSql('alter table "data_fact" add constraint "data_fact_fuel_id_foreign" foreign key ("fuel_id") references "fuel_dimension" ("id") on update cascade;');
    this.addSql('alter table "data_fact" add constraint "data_fact_region_id_foreign" foreign key ("region_id") references "region_dimension" ("id") on update cascade;');
    this.addSql('alter table "data_fact" add constraint "data_fact_power_id_foreign" foreign key ("power_id") references "power_dimension" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "data_fact" drop constraint "data_fact_region_id_foreign";');

    this.addSql('alter table "data_fact" drop constraint "data_fact_power_id_foreign";');

    this.addSql('alter table "data_fact" drop constraint "data_fact_fuel_id_foreign";');

    this.addSql('drop table if exists "time_dimension" cascade;');

    this.addSql('drop table if exists "region_dimension" cascade;');

    this.addSql('drop table if exists "power_dimension" cascade;');

    this.addSql('drop table if exists "fuel_dimension" cascade;');

    this.addSql('drop table if exists "date_dimension" cascade;');

    this.addSql('drop table if exists "data_fact" cascade;');
  }

}

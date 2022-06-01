import { Migration } from '@mikro-orm/migrations';

export class Migration20220601123311 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "region" ("id" serial primary key, "name" varchar(255) not null, "abbreviation" varchar(255) not null, "ref" varchar(255) not null, "timezone" varchar(255) not null);');

    this.addSql('create table "fuel" ("id" serial primary key, "name" varchar(255) not null, "ref" varchar(255) not null, "type" varchar(255) not null);');

    this.addSql('create table "data_fact" ("uuid" varchar(255) not null, "timestamp" timestamptz(0) not null, "value" int not null, "fuel_id" int not null, "region" varchar(255) not null);');
    this.addSql('alter table "data_fact" add constraint "data_fact_pkey" primary key ("uuid");');

    this.addSql('alter table "data_fact" add constraint "data_fact_fuel_id_foreign" foreign key ("fuel_id") references "fuel" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "data_fact" drop constraint "data_fact_fuel_id_foreign";');

    this.addSql('drop table if exists "region" cascade;');

    this.addSql('drop table if exists "fuel" cascade;');

    this.addSql('drop table if exists "data_fact" cascade;');
  }

}

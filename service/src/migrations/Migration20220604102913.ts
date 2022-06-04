import { Migration } from '@mikro-orm/migrations';

export class Migration20220604102913 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "power" ("id" serial primary key, "name" varchar(255) not null, "ref" varchar(255) not null, "type" varchar(255) not null);');

    this.addSql('alter table "data_fact" add column "power_id" int not null;');
    this.addSql('alter table "data_fact" add constraint "data_fact_power_id_foreign" foreign key ("power_id") references "power" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "data_fact" drop constraint "data_fact_power_id_foreign";');

    this.addSql('drop table if exists "power" cascade;');

    this.addSql('alter table "data_fact" drop column "power_id";');
  }

}

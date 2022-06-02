import { Migration } from '@mikro-orm/migrations';

export class Migration20220601141521 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "data_fact" add column "region_id" int not null;');
    this.addSql('alter table "data_fact" add constraint "data_fact_region_id_foreign" foreign key ("region_id") references "region" ("id") on update cascade;');
    this.addSql('alter table "data_fact" drop column "region";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "data_fact" drop constraint "data_fact_region_id_foreign";');

    this.addSql('alter table "data_fact" add column "region" varchar(255) not null;');
    this.addSql('alter table "data_fact" drop column "region_id";');
  }

}

import { Migration } from '@mikro-orm/migrations';

export class Migration20220617032624 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "data_fact" add column "date_id" int not null, add column "time_id" int not null;');
    this.addSql('alter table "data_fact" add constraint "data_fact_date_id_foreign" foreign key ("date_id") references "date_dimension" ("id") on update cascade;');
    this.addSql('alter table "data_fact" add constraint "data_fact_time_id_foreign" foreign key ("time_id") references "time_dimension" ("id") on update cascade;');
    this.addSql('create index "date_index" on "data_fact" ("date_id");');
    this.addSql('create index "time_index" on "data_fact" ("time_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "data_fact" drop constraint "data_fact_date_id_foreign";');
    this.addSql('alter table "data_fact" drop constraint "data_fact_time_id_foreign";');

    this.addSql('drop index "date_index";');
    this.addSql('drop index "time_index";');
    this.addSql('alter table "data_fact" drop column "date_id";');
    this.addSql('alter table "data_fact" drop column "time_id";');
  }

}

import { Migration } from '@mikro-orm/migrations';

export class Migration20220613104105 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "time_dimension" add column "quarter_of_day" int not null, add column "quarter_of_hour" int not null;');
    this.addSql('alter table "time_dimension" drop column "quater_of_day";');
    this.addSql('alter table "time_dimension" drop column "quater_of_hour";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "time_dimension" add column "quater_of_day" int not null, add column "quater_of_hour" int not null;');
    this.addSql('alter table "time_dimension" drop column "quarter_of_day";');
    this.addSql('alter table "time_dimension" drop column "quarter_of_hour";');
  }

}

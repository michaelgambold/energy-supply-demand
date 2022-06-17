import { Migration } from '@mikro-orm/migrations';

export class Migration20220613085912 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "date_dimension" add column "week_of_year" int not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "date_dimension" drop column "week_of_year";');
  }

}

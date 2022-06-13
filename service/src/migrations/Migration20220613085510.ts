import { Migration } from '@mikro-orm/migrations';

export class Migration20220613085510 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "date_dimension" rename column "quater" to "quarter";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "date_dimension" rename column "quarter" to "quater";');
  }

}

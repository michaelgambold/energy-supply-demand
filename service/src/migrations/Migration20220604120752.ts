import { Migration } from '@mikro-orm/migrations';

export class Migration20220604120752 extends Migration {

  async up(): Promise<void> {
    this.addSql('create index "timestamp_index" on "data_fact" ("timestamp");');
    this.addSql('create index "fuel_index" on "data_fact" ("fuel_id");');
    this.addSql('create index "region_index" on "data_fact" ("region_id");');
    this.addSql('create index "power_index" on "data_fact" ("power_id");');
  }

  async down(): Promise<void> {
    this.addSql('drop index "timestamp_index";');
    this.addSql('drop index "fuel_index";');
    this.addSql('drop index "region_index";');
    this.addSql('drop index "power_index";');
  }

}

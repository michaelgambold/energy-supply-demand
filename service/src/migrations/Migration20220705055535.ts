import { Migration } from '@mikro-orm/migrations';

export class Migration20220705055535 extends Migration {

  async up(): Promise<void> {
    this.addSql('create index "time_dimension_quarter_of_day_idx" on "time_dimension" ("quarter_of_day");');
    this.addSql('create index "time_dimension_hour_idx" on "time_dimension" ("hour");');
    this.addSql('create index "time_dimension_hour_quarter_of_hour_idx" on "time_dimension" ("hour", "quarter_of_hour");');
    this.addSql('create index "time_dimension_hour_minute_idx" on "time_dimension" ("hour", "minute");');

    this.addSql('create index "date_dimension_year_month_day_idx" on "date_dimension" ("year", "month_number", "day_of_month");');

    this.addSql('create index "data_fact_date_time_idx" on "data_fact" ("date_id", "time_id");');
    this.addSql('create index "data_fact_dimensions_idx" on "data_fact" ("fuel_id", "region_id", "power_id", "date_id", "time_id");');
    this.addSql('alter index "timestamp_index" rename to "data_fact_timestamp_idx";');
    this.addSql('alter index "fuel_index" rename to "data_fact_fuel_idx";');
    this.addSql('alter index "region_index" rename to "data_fact_region_idx";');
    this.addSql('alter index "power_index" rename to "data_fact_power_idx";');
    this.addSql('alter index "date_index" rename to "data_fact_date_idx";');
    this.addSql('alter index "time_index" rename to "data_fact_time_idx";');
  }

  async down(): Promise<void> {
    this.addSql('drop index "time_dimension_quarter_of_day_idx";');
    this.addSql('drop index "time_dimension_hour_idx";');
    this.addSql('drop index "time_dimension_hour_quarter_of_hour_idx";');
    this.addSql('drop index "time_dimension_hour_minute_idx";');

    this.addSql('drop index "date_dimension_year_month_day_idx";');

    this.addSql('drop index "data_fact_date_time_idx";');
    this.addSql('drop index "data_fact_dimensions_idx";');
    this.addSql('alter index "data_fact_timestamp_idx" rename to "timestamp_index";');
    this.addSql('alter index "data_fact_fuel_idx" rename to "fuel_index";');
    this.addSql('alter index "data_fact_region_idx" rename to "region_index";');
    this.addSql('alter index "data_fact_power_idx" rename to "power_index";');
    this.addSql('alter index "data_fact_date_idx" rename to "date_index";');
    this.addSql('alter index "data_fact_time_idx" rename to "time_index";');
  }

}

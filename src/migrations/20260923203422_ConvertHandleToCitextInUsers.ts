import { Migration } from "@mikro-orm/migrations";

export class Migration20260923203422_convert_handle_to_citext_in_users extends Migration {
  override name = "Migration20260923203422_convert_handle_to_citext_in_users";

  override up(): void | Promise<void> {
    this.addSql(`alter table "users" alter column "handle" type citext using ("handle"::citext);`);
  }

  override down(): void | Promise<void> {
    this.addSql(
      `alter table "users" alter column "handle" type varchar(32) using ("handle"::varchar(32));`,
    );
  }
}

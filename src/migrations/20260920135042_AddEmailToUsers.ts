import { Migration } from "@mikro-orm/migrations";

export class Migration20260920135042_add_email_to_users extends Migration {
  override name = "Migration20260920135042_add_email_to_users";

  override up(): void | Promise<void> {
    this.addSql(`create extension if not exists citext;`);

    this.addSql(`alter table "users" add "email" citext not null;`);
    this.addSql(
      `alter table "users" add constraint "users_email_unique" unique ("email");`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "users" drop constraint "users_email_unique";`);
    this.addSql(`alter table "users" drop column "email";`);
  }
}

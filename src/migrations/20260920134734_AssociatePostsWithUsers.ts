import { Migration } from "@mikro-orm/migrations";

export class Migration20260920134734_associate_posts_with_users extends Migration {
  override name = "Migration20260920134734_associate_posts_with_users";

  override up(): void | Promise<void> {
    this.addSql(`delete from posts;`);

    this.addSql(
      `alter table "posts" add "user_id" uuid not null, add "parent_id" uuid null;`,
    );
    this.addSql(
      `alter table "posts" add constraint "posts_user_id_foreign" foreign key ("user_id") references "users" ("id");`,
    );
    this.addSql(
      `alter table "posts" add constraint "posts_parent_id_foreign" foreign key ("parent_id") references "posts" ("id") on delete set null;`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "posts" drop constraint "posts_user_id_foreign";`);
    this.addSql(
      `alter table "posts" drop constraint "posts_parent_id_foreign";`,
    );

    this.addSql(
      `alter table "posts" drop column "user_id", drop column "parent_id";`,
    );
  }
}

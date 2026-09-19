import { Migration } from "@mikro-orm/migrations";

export class Migration20260919130625_Initial extends Migration {
  override name = "Migration20260919130625_Initial";

  override up(): void | Promise<void> {
    this.addSql(
      `create table "posts" ("id" uuid not null default uuidv7(), "inserted_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "title" varchar(255) not null, "slug" varchar(255) not null, "body" text not null, primary key ("id"));`,
    );
    this.addSql(`alter table "posts" add constraint "posts_slug_unique" unique ("slug");`);
  }
}

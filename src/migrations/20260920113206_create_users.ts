import { Migration } from '@mikro-orm/migrations';

export class Migration20260920113206_create_users extends Migration {

  override name = 'Migration20260920113206_create_users';

  override up(): void | Promise<void> {
    this.addSql(`create table "users" ("id" uuid not null default uuidv7(), "inserted_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "handle" varchar(32) not null, "display_name" varchar(64) not null, "password_hash" varchar(255) null, "bio" text null, primary key ("id"));`);
    this.addSql(`alter table "users" add constraint "users_handle_unique" unique ("handle");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "users" cascade;`);
  }

}

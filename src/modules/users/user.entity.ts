import { defineEntity, p } from "@mikro-orm/core";
import { BaseEntity } from "../common/base.entity.js";
import { Post } from "../posts/post.entity.js";
import argon2 from "argon2";

export const UserSchema = defineEntity({
  name: "User",
  tableName: "users",
  extends: BaseEntity,
  properties: {
    handle: p.string().length(32).unique(),
    email: p.string().columnType("citext").unique(),
    displayName: p.string().length(64),
    passwordHash: p.string().nullable(),
    bio: p.text().lazy().nullable(),
    posts: () => p.oneToMany(Post).mappedBy("user"),
  },
});

export class User extends UserSchema.class {
  async verifyPassword(password: string): Promise<boolean> {
    if (!this.passwordHash) return false;

    return await argon2.verify(this.passwordHash, password);
  }
}

UserSchema.setClass(User);

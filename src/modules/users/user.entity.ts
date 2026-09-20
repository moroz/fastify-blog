import { defineEntity, p } from "@mikro-orm/core";
import { BaseEntity } from "@modules/common/base.entity.js";
import { Post } from "@modules/posts/post.entity.js";

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

export class User extends UserSchema.class {}
UserSchema.setClass(User);

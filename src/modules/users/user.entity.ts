import { defineEntity, p } from "@mikro-orm/core";
import { BaseEntity } from "@modules/common/base.entity.js";

export const UserSchema = defineEntity({
  name: "User",
  tableName: "users",
  extends: BaseEntity,
  properties: {
    handle: p.string().length(32).unique(),
    displayName: p.string().length(64),
    passwordHash: p.string().nullable(),
    bio: p.text().lazy().nullable(),
  },
});

export class User extends UserSchema.class {}
UserSchema.setClass(User);

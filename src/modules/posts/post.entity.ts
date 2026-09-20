import { defineEntity, p } from "@mikro-orm/core";
import { BaseEntity } from "@modules/common/base.entity.js";
import { User } from "@modules/users/user.entity.js";

export const PostEntity = defineEntity({
  name: "Post",
  tableName: "posts",
  extends: BaseEntity,
  properties: {
    title: p.string(),
    slug: p.string().unique(),
    body: p.text().lazy(),
    user: () => p.manyToOne(User),
    parent: () => p.manyToOne(Post).nullable(),
  },
});

export class Post extends PostEntity.class {}
PostEntity.setClass(Post);

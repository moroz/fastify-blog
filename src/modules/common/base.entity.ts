import { defineEntity, p } from "@mikro-orm/core";

export const BaseEntity = defineEntity({
  name: "BaseEntity",
  abstract: true,
  properties: {
    id: p.uuid().primary().defaultRaw("uuidv7()"),
    insertedAt: p.datetime().defaultRaw("now()"),
    updatedAt: p
      .datetime()
      .defaultRaw("now()")
      .onUpdate(() => new Date()),
  },
});

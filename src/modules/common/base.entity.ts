import { defineEntity, p } from "@mikro-orm/core";
import { InstantType } from "mikro-orm-temporal";

export const BaseEntity = defineEntity({
  name: "BaseEntity",
  abstract: true,
  properties: {
    id: p.uuid().primary().defaultRaw("uuidv7()"),
    insertedAt: p.type(InstantType).defaultRaw("now()"),
    updatedAt: p
      .type(InstantType)
      .defaultRaw("now()")
      .onUpdate(() => Temporal.Now.instant()),
  },
});

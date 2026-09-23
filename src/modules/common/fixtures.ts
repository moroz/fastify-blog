import { TEST_DATABASE_URL } from "@/config.js";
import { initServices, Services } from "@/services.js";
import { EntityManager, MikroORM } from "@mikro-orm/postgresql";
import { afterAll, test as base, beforeAll } from "vitest";

let services: Services;

beforeAll(async () => {
  services ??= await initServices({
    clientUrl: TEST_DATABASE_URL,
  });
  await services.orm.migrator.up();
});

afterAll(async () => {
  await services.orm.close();
});

export const test = base.extend<{ em: EntityManager }>({
  em: async ({}, use) => {
    await use(services.em.fork());
  },
});

export function uniquePart(): string {
  return Buffer.from(crypto.getRandomValues(new Uint8Array(2))).toString("hex");
}

export function uniqueEmail(): string {
  return `user-${uniquePart()}@example.com`;
}

export function uniqueHandle(): string {
  return `${uniquePart()}`;
}

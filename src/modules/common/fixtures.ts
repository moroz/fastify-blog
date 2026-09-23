import { TEST_DATABASE_URL } from "@/config.js";
import { initServices, Services } from "@/services.js";
import { EntityManager, MikroORM } from "@mikro-orm/postgresql";
import { User } from "@modules/users/user.entity.js";
import { UserService } from "@modules/users/user.service.js";
import { afterAll, test as base, beforeAll } from "vitest";

let services: Services;

beforeAll(async () => {
  services ??= await initServices({
    clientUrl: TEST_DATABASE_URL,
  });
  await services.orm.migrator.up();

  await services.em.fork().nativeDelete(User, {});
});

afterAll(async () => {
  await services.orm.close();
});

const testWithEm = base.extend<{ em: EntityManager }>({
  em: async ({}, use) => {
    const em = services.em.fork();
    await em.begin();
    try {
      await use(em);
    } finally {
      await em.rollback();
    }
  },
});

export const test = testWithEm.extend<{ userService: UserService }>({
  userService: async ({ em }, use) => {
    await use(new UserService(em));
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

import { initServices, Services } from "@/services.js";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { RegisterUserInput, UserService } from "./user.service.js";
import { TEST_DATABASE_URL } from "@/config.js";
import { User } from "./user.entity.js";

let services: Services;

beforeAll(async () => {
  services = await initServices({
    clientUrl: TEST_DATABASE_URL,
  });
  await services.orm.migrator.up();

  services.em.nativeDelete(User, {});
});

afterAll(async () => {
  await services.orm.close();
});

describe(UserService, () => {
  describe("registerUser", () => {
    test("creates a user with valid params", async () => {
      const em = services.em.fork();
      const srv = new UserService(em);

      const params: RegisterUserInput = {
        email: "user@example.com",
        displayName: "Example User",
        handle: "example",
        password: "foobar",
        passwordConfirmation: "foobar",
        bio: null,
      };

      const user = await srv.registerUser(params);
      expect(user).not.toBe(null);
      expect(user.passwordHash).toMatch(/^\$argon2id\$/);
    });
  });
});

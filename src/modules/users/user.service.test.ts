import { initServices, Services } from "@/services.js";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import {
  RegisterUserInput,
  registerUserInputSchema,
  UserService,
} from "./user.service.js";
import { TEST_DATABASE_URL } from "@/config.js";
import { User } from "./user.entity.js";
import { ZodError } from "zod";

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

function uniquePart(): string {
  return Buffer.from(crypto.getRandomValues(new Uint8Array(4))).toString("hex");
}

function uniqueEmail(): string {
  return `user-${uniquePart()}@example.com`;
}

function uniqueHandle(): string {
  return `${uniquePart()}`;
}

function validParams(
  overrides?: Partial<RegisterUserInput>,
): RegisterUserInput {
  return {
    email: uniqueEmail(),
    displayName: "Example User",
    handle: uniqueHandle(),
    password: "foobar",
    passwordConfirmation: "foobar",
    bio: null,
    ...overrides,
  };
}

describe(UserService, () => {
  describe("RegisterUserInput", () => {
    test("is valid with valid params", () => {
      const params = validParams();
      const result = registerUserInputSchema.safeParse(params);
      expect(result.success).toBe(true);
    });

    test("is invalid with invalid email", () => {
      const examples = ["invalid@email", "", "invalid"];

      for (const email of examples) {
        const params = validParams({ email });
        const result = registerUserInputSchema.safeParse(params);
        expect(result.success).toBe(false);
        expect(result.error?.issues).toEqual([
          expect.objectContaining({ path: ["email"] }),
        ]);
      }
    });

    test("is invalid with invalid handle", () => {
      const examples = ["too_long_longer_than_15_chars", "", "invalid_!"];

      for (const handle of examples) {
        const params = validParams({ handle });
        const result = registerUserInputSchema.safeParse(params);
        expect(result.success).toBe(false);
        expect(result.error?.issues).toEqual([
          expect.objectContaining({ path: ["handle"] }),
        ]);
      }
    });
  });

  describe("registerUser", () => {
    test("creates a user with valid params", async () => {
      const em = services.em.fork();
      const srv = new UserService(em);

      const user = await srv.registerUser(validParams());
      expect(user).not.toBeNull();
      expect(user.passwordHash).toMatch(/^\$argon2id\$/);
    });

    test("rejects a user with duplicate email address", async () => {
      const email = uniqueEmail();

      const em = services.em.fork();
      const srv = new UserService(em);

      const existing = await srv.registerUser(
        validParams({
          email,
        }),
      );

      expect(existing).not.toBeNull();

      const actual: ZodError = await srv
        .registerUser(
          validParams({
            email,
          }),
        )
        .catch((e) => e);

      expect(actual.issues).toEqual([
        expect.objectContaining({ path: ["email"] }),
      ]);
    });

    test("rejects a user with duplicate handle", async () => {
      const handle = uniqueHandle();

      const em = services.em.fork();
      const srv = new UserService(em);

      const existing = await srv.registerUser(
        validParams({
          handle,
        }),
      );

      expect(existing).not.toBeNull();

      const actual: ZodError = await srv
        .registerUser(
          validParams({
            handle,
          }),
        )
        .catch((e) => e);

      expect(actual.issues).toEqual([
        expect.objectContaining({ path: ["handle"] }),
      ]);
    });
  });
});

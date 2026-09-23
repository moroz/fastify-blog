import { test, uniqueEmail, uniqueHandle } from "@modules/common/fixtures.js";
import { describe, expect } from "vitest";
import { ZodError } from "zod";
import {
  RegisterUserInput,
  registerUserInputSchema,
  UserService,
} from "./user.service.js";

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
    test("creates a user with valid params", async ({ em }) => {
      const srv = new UserService(em);

      const user = await srv.registerUser(validParams());
      expect(user).not.toBeNull();
      expect(user.passwordHash).toMatch(/^\$argon2id\$/);
    });

    test("rejects a user with duplicate email address", async ({ em }) => {
      const email = uniqueEmail();

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

    test("rejects a user with duplicate handle", async ({ em }) => {
      const handle = uniqueHandle();

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

  describe("authenticateUserByEmailPassword", () => {
    test("returns user with valid params", async ({ em }) => {
      const srv = new UserService(em);

      const params = validParams();

      const user = await srv.registerUser(params);
      expect(user).not.toBeNull();

      const actual = await srv.authenticateUserByEmailPassword(
        params.email,
        params.password,
      );
      expect(actual?.id).toEqual(user.id);
    });
  });
});

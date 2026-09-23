import { test, uniqueEmail, uniqueHandle } from "@modules/common/fixtures.js";
import { beforeEach, describe, expect } from "vitest";
import { ZodError } from "zod";
import {
  RegisterUserInput,
  registerUserInputSchema,
  UserService,
} from "./user.service.js";
import { User } from "./user.entity.js";

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
    let user: User;
    const email = uniqueEmail();
    const password = "password123";

    test.beforeEach(async ({ userService }) => {
      const params = validParams({
        email,
        password,
        passwordConfirmation: password,
      });
      user = await userService.registerUser(params);
      expect(user).not.toBeNull();
    });

    test("returns user with valid params", async ({ userService }) => {
      const actual = await userService.authenticateUserByEmailPassword(
        email,
        password,
      );
      expect(actual?.id).toEqual(user.id);
    });

    test("returns null with invalid params", async ({ userService }) => {
      const examples: ReadonlyArray<{ email: string; password: string }> = [
        { email, password: "invalid" },
        { email: "invalid@email", password },
        { email: "invalid@email", password: "invalid" },
      ];

      for (const { email, password } of examples) {
        const actual = await userService.authenticateUserByEmailPassword(
          email,
          password,
        );
        expect(actual).toBeNull();
      }
    });
  });
});

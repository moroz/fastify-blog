import { EntityManager } from "@mikro-orm/postgresql";
import argon2 from "argon2";
import { z } from "zod";
import { parse } from "zod/v4/core";

export const registerUserInputSchema = z
  .object({
    email: z.string(),
    handle: z.string(),
    password: z.string(),
    passwordConfirmation: z.string(),
  })
  .refine((user) => user.password === user.passwordConfirmation, {
    error: "Passwords do not match.",
    path: ["passwordConfirmation"],
  });

export type RegisterUserInput = z.infer<typeof registerUserInputSchema>;

export class UserService {
  constructor(private em: EntityManager) {}

  async registerUser(input: RegisterUserInput) {
    const parseResult = registerUserInputSchema.safeParse(input);
    if (!parseResult.success) {
      return parseResult.error;
    }

    const params = parseResult.data;

    const passwordHash = await argon2.hash(params.password);
  }
}

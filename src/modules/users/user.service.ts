import { EntityManager } from "@mikro-orm/postgresql";
import { z } from "zod";

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
  }
}

import { EntityManager } from "@mikro-orm/postgresql";
import argon2 from "argon2";
import { z } from "zod";
import { User } from "./user.entity.js";

export const registerUserInputSchema = z
  .object({
    email: z.email(),
    handle: z.string(),
    displayName: z.string(),
    password: z.string(),
    passwordConfirmation: z.string(),
    bio: z.string().nullable(),
  })
  .refine((user) => user.password === user.passwordConfirmation, {
    error: "Passwords do not match.",
    path: ["passwordConfirmation"],
  });

export type RegisterUserInput = z.infer<typeof registerUserInputSchema>;

export class UserService {
  constructor(private em: EntityManager) {}

  async registerUser(input: RegisterUserInput) {
    const params = registerUserInputSchema.parse(input);
    const passwordHash = await argon2.hash(params.password);

    const user = this.em.create(User, {
      displayName: params.displayName,
      bio: params.bio,
      email: params.email,
      passwordHash,
      handle: params.handle,
    });

    await this.em.flush();

    return user;
  }

  async authenticateUserByEmailPassword(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.em.findOne(User, { email });
    if (!user) return null;

    if (!(await user.verifyPassword(password))) return null;
    return user;
  }
}

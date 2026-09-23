import {
  EntityManager,
  EntityRepository,
  UniqueConstraintViolationException,
} from "@mikro-orm/postgresql";
import argon2 from "argon2";
import { z, ZodError } from "zod";
import { User } from "./user.entity.js";

export const registerUserInputSchema = z
  .object({
    email: z.email(),
    handle: z
      .string()
      .max(15, "Handle cannot be longer than 15 characters")
      .regex(
        /^[A-Za-z0-9_]+$/,
        "Handle may only contain letters, numbers, and underscores.",
      ),
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
  private repository: EntityRepository<User>;

  private constraintMapping: Record<string, keyof RegisterUserInput> = {
    users_email_unique: "email",
    users_handle_unique: "handle",
  };

  constructor(private em: EntityManager) {
    this.repository = em.getRepository(User);
  }

  async registerUser(input: RegisterUserInput) {
    const params = registerUserInputSchema.parse(input);
    const passwordHash = await argon2.hash(params.password);

    const user = this.repository.create({
      displayName: params.displayName,
      bio: params.bio,
      email: params.email,
      passwordHash,
      handle: params.handle,
    });

    try {
      await this.em.flush();
    } catch (err) {
      if (err instanceof UniqueConstraintViolationException) {
        const column = this.constraintMapping[(err as any).constraint];

        if (column) {
          throw new ZodError([
            {
              code: "custom",
              message: "Has already been taken",
              path: [column],
            },
          ]);
        }
      }

      throw err;
    }

    return user;
  }

  async authenticateUserByEmailPassword(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.repository.findOne({ email });
    if (!user) return null;

    if (!(await user.verifyPassword(password))) return null;
    return user;
  }
}

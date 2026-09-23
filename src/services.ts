import { EntityManager, MikroORM, Options } from "@mikro-orm/postgresql";
import mikroOrmConfig from "@/mikro-orm.config.js";
import { UserService } from "@modules/users/user.service.js";

export interface Services {
  orm: MikroORM;
  em: EntityManager;
  userService: UserService;
}

let cache: Services;

export async function initServices(options?: Partial<Options>): Promise<Services> {
  if (cache) {
    return cache;
  }

  const orm = await MikroORM.init({
    ...mikroOrmConfig,
    ...options,
  });

  return (cache = {
    orm: orm,
    em: orm.em,
    userService: new UserService(orm.em),
  });
}

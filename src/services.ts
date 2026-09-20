import { EntityManager, MikroORM, Options } from "@mikro-orm/postgresql";
import mikroOrmConfig from "@/mikro-orm.config.js";

export interface Services {
  orm: MikroORM;
  em: EntityManager;
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
  });
}

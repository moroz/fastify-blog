import Fastify from "fastify";
import { fastifyPostgres } from "@fastify/postgres";
import { sessionRoutes } from "./modules/session/session-routes.js";
import { pageRoutes } from "./modules/pages/page-routes.js";
import { MikroORM, RequestContext } from "@mikro-orm/postgresql";
import mikroOrmConfig from "@/mikro-orm.config.js";
import { fastifyStatic } from "@fastify/static";
import path from "node:path";
import "zod/compile"; // automatically compile all zod schemas in the application

const orm = await MikroORM.init({
  ...mikroOrmConfig,
  debug: true,
});

const app = Fastify({
  logger: true,
});

app.addHook("onRequest", (_req, _reply, done) => {
  RequestContext.create(orm.em, done);
});

app.addHook("onClose", async () => {
  await orm.close();
});

app.register(fastifyPostgres, {
  connectionString: "postgres://postgres:postgres@localhost/fastify_blog_dev",
});

app.register(fastifyStatic, {
  root: path.join(import.meta.dirname, "assets/dist"),
  prefix: "/assets/",
});

app.register(pageRoutes);
app.register(sessionRoutes);

try {
  await app.listen({ port: 3000 });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

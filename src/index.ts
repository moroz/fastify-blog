import Fastify from "fastify";
import { fastifyPostgres } from "@fastify/postgres";
import { sessionRoutes } from "./modules/session/session-routes.js";
import { pageRoutes } from "./modules/pages/page-routes.js";

const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyPostgres, {
  connectionString: "postgres://postgres:postgres@localhost/fastify_blog_dev",
});

fastify.register(pageRoutes);
fastify.register(sessionRoutes);

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}

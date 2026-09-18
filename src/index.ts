import Fastify from "fastify";
import routes from "./routes";
import { fastifyPostgres } from "@fastify/postgres";
import { sessionRoutes } from "./modules/session/session-routes";

const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyPostgres, {
  connectionString: "postgres://postgres:postgres@localhost/fastify_blog_dev",
});

fastify.register(routes);
fastify.register(sessionRoutes);

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}

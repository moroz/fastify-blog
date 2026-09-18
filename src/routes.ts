import { FastifyInstance } from "fastify";

export default async function routes(fastify: FastifyInstance, options: Object) {
  fastify.get("/", async (request, reply) => {
    return { hello: "world" };
  });
}

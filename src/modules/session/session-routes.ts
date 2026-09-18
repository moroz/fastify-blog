import { FastifyInstance } from "fastify";

export async function sessionRoutes(fastify: FastifyInstance, options: object) {
  fastify.get("/session", async (request, reply) => {
    return { data: null };
  });
}

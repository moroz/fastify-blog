import { FastifyInstance } from "fastify";
import { Index } from "./views/index.js";

export async function pageRoutes(app: FastifyInstance, options: object) {
  app.get("/", (request, reply) => {
    const html = <Index />;
    return reply.type("text/html; charset=utf-8").send(html);
  });
}

import { FastifyInstance } from "fastify";
import { Index } from "./views/index.js";
import { initServices } from "@/services.js";
import { Post } from "@/modules/posts/post.entity.js";

export async function pageRoutes(app: FastifyInstance, options: object) {
  const { em } = await initServices();

  app.get("/", async (request, reply) => {
    const posts = await em.find(Post, {});
    return reply.type("text/html; charset=utf-8").send(Index({ posts }));
  });
}

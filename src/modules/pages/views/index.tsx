import { Layout } from "@/modules/common/views/layout.js";
import { Post } from "@/modules/posts/post.entity.js";

interface Props {
  posts: Post[];
}

export function Index({ posts }: Props) {
  return (
    <Layout title="Home page">
      <main class="container mx-auto">
        <h1 class="text-2xl font-bold text-blue-600">Hello world!</h1>
        <section>
          <h2>Posts</h2>
          {posts.map((post) => {
            return (
              <article>
                <h3>
                  {post.title} ({post.id})
                </h3>
              </article>
            );
          })}
        </section>
        <div id="svelte-root" />
      </main>
    </Layout>
  );
}

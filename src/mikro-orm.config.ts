import { defineConfig } from "@mikro-orm/postgresql";
import { Migrator } from "@mikro-orm/migrations";
import { DATABASE_URL } from "./config.js";

export default defineConfig({
  clientUrl: DATABASE_URL,
  entities: ["./dist/**/*.entity.js"],
  entitiesTs: ["./src/**/*.entity.ts"],
  extensions: [Migrator],
  migrations: {
    fileName: (timestamp, name) => {
      if (!name) {
        throw new Error("Migration must have a name!");
      }
      return `${timestamp}_${name}`;
    },
  },
});

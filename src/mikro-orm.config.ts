import { defineConfig } from "@mikro-orm/postgresql";
import { Migrator } from "@mikro-orm/migrations";
import { DATABASE_URL } from "./config.js";
import camelcase from "camelcase";

export default defineConfig({
  clientUrl: DATABASE_URL,
  entities: ["./dist/**/*.entity.js"],
  entitiesTs: ["./src/**/*.entity.ts"],
  dynamicImportProvider: (id) => import(id),
  extensions: [Migrator],
  migrations: {
    fileName: (timestamp, name) => {
      if (!name) {
        throw new Error("Migration must have a name!");
      }
      return `${timestamp}_${camelcase(name, { pascalCase: true })}`;
    },
  },
});

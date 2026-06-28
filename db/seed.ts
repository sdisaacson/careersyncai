import { getDb } from "../server/queries/api/connection.js";
// TODO: import tables from "./schema"

async function seed() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const db = getDb();
  console.log("Seeding database...");

  // TODO: insert seed data, e.g. (use db variable)
  // await db.insert(schema.posts).values([
  //   { title: "First post", content: "Hello world" },
  // ]);

  console.log("Done.");
  process.exit(0); // close Postgres connection
}

seed();

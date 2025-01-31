import { MongoClient } from "mongodb";
import { startStandaloneServer } from "@apollo/server/standalone";
import { schema } from "./schema.ts";
import { ApolloServer } from "@apollo/server";
import { resolvers } from "./resolvers.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");

if (!MONGO_URL) {
  throw new Error("Problema con MONGO_URL");
}

const client = new MongoClient(MONGO_URL);
await client.connect();

console.info("Mongo connected");

const db = client.db("RestaurantExam");
const RestaurantCollection = db.collection("Restaurant");

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  context: async () => ({ RestaurantCollection }),
});

console.info(`Server started at ${url}`);

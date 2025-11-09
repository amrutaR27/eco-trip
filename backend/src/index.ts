import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@as-integrations/express4';
import { gql } from "graphql-tag";
import cors from "cors";
import bodyParser from "body-parser";


const typeDefs = gql`
  type Route {
    id: ID!
    origin: String!
    destination: String!
    price: Float
    duration: String
  }

  type Query {
    getRoutes(origin: String!, destination: String!): [Route!]!
  }
`;

type Connection = {
  products?: string[] | null;
  duration?: string | null;
};

const resolvers = {
  Query: {
    getRoutes: async (_parent: unknown, args: { origin: string; destination: string }) => {
      const { origin, destination } = args;

      const response = await fetch(
        `https://transport.opendata.ch/v1/connections?from=${origin}&to=${destination}`
      );

      const data: { connections?: Connection[] } = await response.json();

      if (!data || !Array.isArray(data.connections)) return [];

      return data.connections.map((conn: Connection, i: number) => ({
        id: i.toString(),
        origin,
        destination,
        price: conn.products?.includes("ICE") ? 50 + i * 10 : 30 + i * 5,
        duration: (conn.duration ?? "Unknown").replace("00d", "").trim() || "Unknown",
      }));
    },
  },
};

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Create Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Start Apollo
const startServer = async () => {
  await server.start();
  app.use("/graphql", expressMiddleware(server));
  app.listen({ port: 4000 }, () =>
    console.log("🚀 Server ready at http://localhost:4000/graphql")
  );
};

startServer();
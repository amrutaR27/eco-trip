import express from "express";
import { ApolloServer } from "apollo-server-express";
import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Route {
    id: ID!
    origin: String!
    destination: String!
    price: Float!
    duration: String!
  }

  type Query {
    getRoutes(origin: String!, destination: String!): [Route!]!
  }
`;

const routes = [
  { id: "1", origin: "London", destination: "Paris", price: 55.5, duration: "2h20" },
  { id: "2", origin: "London", destination: "Manchester", price: 25.0, duration: "2h00" },
];

const resolvers = {
  Query: {
    getRoutes: (_: any, { origin, destination }: any) =>
      routes.filter(
        (r) =>
          r.origin.toLowerCase().includes(origin.toLowerCase()) &&
          r.destination.toLowerCase().includes(destination.toLowerCase())
      ),
  },
};

async function startServer() {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  app.listen(4000, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

startServer();

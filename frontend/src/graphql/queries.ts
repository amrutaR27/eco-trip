import { gql } from "@apollo/client";

export const GET_ROUTES = gql`
  query GetRoutes($origin: String!, $destination: String!) {
    getRoutes(origin: $origin, destination: $destination) {
      id
      origin
      destination
      price
      duration
    }
  }
`;

export interface Route {
  id: string;
  origin: string;
  destination: string;
  price: number;
  duration: string;
}

export interface GetRoutesData {
  getRoutes: Route[];
}

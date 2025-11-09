import React, { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_ROUTES } from "./graphql/queries";
import type { GetRoutesData } from "./graphql/queries";
import { SearchForm } from "./components/SearchForm";

const App: React.FC = () => {
  const [lastQuery, setLastQuery] = useState({ origin: "", destination: "" });
  const { loading, data, error, refetch } = useQuery<GetRoutesData>(GET_ROUTES, {
    variables: lastQuery,
    skip: !lastQuery.origin || !lastQuery.destination,
  });

  const handleSearch = (origin: string, destination: string) => {
    // if the same query is searched again, trigger a refetch, otherwise update lastQuery to auto-run the query
    if (origin === lastQuery.origin && destination === lastQuery.destination) {
      refetch?.({ origin, destination });
      return;
    }
    setLastQuery({ origin, destination });
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4 text-center">EcoTrip 🌍</h1>
      <SearchForm onSearch={handleSearch} />

      {loading && <p>Searching routes...</p>}
      {error && <p className="text-red-600">Error: {error.message}</p>}

      {data && data.getRoutes.length === 0 && <p>No routes found.</p>}

      {data && data.getRoutes.length > 0 && (
        <div className="mt-4 space-y-2">
          {data.getRoutes.map((route: GetRoutesData["getRoutes"][number]) => (
            <div
              key={route.id}
              className="border rounded p-3 shadow-sm flex justify-between"
            >
              <div>
                <p>
                  <strong>{route.origin}</strong> →{" "}
                  <strong>{route.destination}</strong>
                </p>
                <p className="text-gray-600">{route.duration}</p>
              </div>
              <p className="font-semibold">£{route.price.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
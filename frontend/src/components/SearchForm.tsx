import React, { useState } from "react";

interface Props {
  onSearch: (origin: string, destination: string) => void;
}

export const SearchForm: React.FC<Props> = ({ onSearch }) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(origin, destination);
      }}
      className="p-4 flex gap-2"
    >
      <input
        className="border rounded p-2"
        placeholder="From"
        value={origin}
        onChange={(e) => setOrigin(e.target.value)}
      />
      <input
        className="border rounded p-2"
        placeholder="To"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <button className="bg-blue-600 text-white rounded p-2" type="submit">
        Search
      </button>
    </form>
  );
};
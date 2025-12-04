import React, { useState } from "react";
import Properties from "../components/Properties";

export default function Home() {
  // "All", "forRent", "forSale"
  const [filter, setFilter] = useState("All");

  return (
    <div>
      {/* Header */}
      <header className="flex items-center justify-between p-6 bg-green-700 text-white">
        <img src="/favicon.ico" alt="Palms Estate favicon" className="h-8 mr-4" />
        <h1 className="text-2xl font-bold">Palms Estate</h1>
        <nav>
          <button
            onClick={() => setFilter("All")}
            className={`mx-1 px-4 py-2 rounded ${filter==="All" ? "bg-green-900" : "bg-green-600"}`}
          >
            All Properties
          </button>
          <button
            onClick={() => setFilter("forRent")}
            className={`mx-1 px-4 py-2 rounded ${filter==="forRent" ? "bg-green-900" : "bg-green-600"}`}
          >
            For Rent
          </button>
          <button
            onClick={() => setFilter("forSale")}
            className={`mx-1 px-4 py-2 rounded ${filter==="forSale" ? "bg-green-900" : "bg-green-600"}`}
          >
            For Sale
          </button>
        </nav>
      </header>
      {/* Properties List */}
      <Properties filter={filter} />
    </div>
  );
}
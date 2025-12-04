import React from "react";
import propertiesData from "../data/properties.json";

function filterProperties(list, filter) {
  if (filter === "forRent")
    return list.filter((p) => p.status === "forRent");
  if (filter === "forSale")
    return list.filter((p) => p.status === "forSale");
  return list;
}

export default function Properties({ filter }) {
  const properties = filterProperties(propertiesData, filter);

  return (
    <div className="grid md:grid-cols-3 gap-8 p-6">
      {properties.map((prop) => (
        <div key={prop.id} className="bg-white shadow rounded p-4">
          <h2 className="text-xl font-bold">{prop.name}</h2>
          <p>{prop.description}</p>
          <span className="block mt-2 badge bg-green-800 text-white px-2 py-1 rounded">
            {prop.status === "forSale" ? "For Sale" : prop.status === "forRent" ? "For Rent" : ""}
          </span>
        </div>
      ))}
    </div>
  );
}
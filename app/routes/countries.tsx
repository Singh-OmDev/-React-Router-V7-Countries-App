import { Link } from "react-router";
import type { Route } from "./+types/countries";
import { useState } from "react";

// ✅ Correct API URL with 'fields' specified
export async function clientLoader() {
  try {
    const res = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,region,population,cca3"
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch countries: ${res.status}`);
    }

    const data = await res.json();
    return data; // returns array of countries
  } catch (error) {
    console.error("Error fetching countries:", error);
    return []; // return empty array if API fails
  }
}

export default function Countries({ loaderData }: Route.ComponentProps) {
  const [search, setSearch] = useState<string>("");
  const [region, setRegion] = useState<string>("");

  // ✅ Always ensure it's an array
  const countries = Array.isArray(loaderData) ? loaderData : [];

  // ✅ Safe filtering
  const filteredCountries = countries.filter((country: any) => {
    const countryName = country?.name?.common?.toLowerCase() || "";
    const countryRegion = country?.region?.toLowerCase() || "";

    const matchesSearch =
      !search || countryName.includes(search.toLowerCase());
    const matchesRegion =
      !region || countryRegion === region.toLowerCase();

    return matchesSearch && matchesRegion;
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Countries</h2>

      {/* Search and Region Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-1/2 focus:outline-none focus:border-indigo-500"
        />
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-1/2 focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Regions</option>
          <option value="africa">Africa</option>
          <option value="americas">Americas</option>
          <option value="asia">Asia</option>
          <option value="europe">Europe</option>
          <option value="oceania">Oceania</option>
        </select>
      </div>

      {/* Render Countries */}
      {countries.length === 0 ? (
        <div className="text-red-600">⚠️ Failed to load countries or API error.</div>
      ) : filteredCountries.length === 0 ? (
        <div>No countries match your filters.</div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredCountries.map((country: any) => (
            <li
              key={country.cca3}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow hover:shadow-lg transition"
            >
              <Link
                to={`/countries/${country.name.common}`}
                className="text-indigo-600 hover:underline text-lg font-semibold"
              >
                {country.name.common}
              </Link>
              <div className="text-gray-600 text-sm mt-1">
                Region: {country.region} <br />
                Population: {country.population?.toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

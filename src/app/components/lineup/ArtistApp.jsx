"use client";
import ArtisList from "./ArtistList";
import FilterMenuLineup from "./FilterMenuLineup";
import { useState, useContext } from "react";
// import { ApiContextP } from "@/app/lib/ApiContext.js";

const ArtistApp = ({ scheduleBand }) => {
  const [searchFilter, setSearchFilter] = useState("");
  const [genreFilter, setGenreFilter] = useState([]);

  const filteredBands = scheduleBand.filter((band) => {
    const matchesName = band.band.name
      .toLowerCase()
      .includes(searchFilter.toLowerCase());
    const matchesGenre =
      genreFilter.length === 0 || genreFilter.includes(band.band.genre);
    return matchesName && matchesGenre;
  });

  return (
    <div className="grid grid-col-[0.1fr_1fr_0.1fr] gap-4">
      <h1 className="uppercase  text-6xl italic pt-20 text-center font-extrabold text-black">
        Artister
      </h1>
      <FilterMenuLineup
        setFilter={setSearchFilter}
        setFilterGenre={setGenreFilter}
        bandData={scheduleBand}
      />

      <ArtisList bandData={filteredBands}></ArtisList>
    </div>
  );
};

export default ArtistApp;

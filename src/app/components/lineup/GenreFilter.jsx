import SearchFilterLineup from "./SearchFilterLineup";

const GenreFilter = ({ setFilterGenre, bandData, setFilter }) => {
  // Find unikke genrer i dataen
  const genres = Array.from(new Set(bandData.map((band) => band.band.genre)));

  // Håndter ændringer i checkbox
  const handleCheckboxChange = (e) => {
    const genre = e.target.value;
    const label = e.target.parentElement; // Reference til label-elementet

    setFilterGenre((prevGenres) => {
      if (prevGenres.includes(genre)) {
        // Fjern markering
        label.classList.remove("bg-black", "text-background");
        label.classList.add("bg-background", "text-black");
        return prevGenres.filter((g) => g !== genre);
      } else {
        // Tilføj markering
        label.classList.remove("bg-background", "text-black");
        label.classList.add("bg-black", "text-background");
        return [...prevGenres, genre];
      }
    });
  };

  // Nulstil alle valgte genrer
  const resetGenres = () => {
    setFilterGenre([]);
    // Fjern styling for alle labels
    document.querySelectorAll(".genre-label").forEach((label) => {
      label.classList.remove("bg-green", "text-black");
      label.classList.add("text-background", "text-black");
    });
  };

  return (
    <div className="pt-10">
      <div className="flex gap-4">
        <h3 className="font-Inter text-xl font-extrabold italic pb-4 text-black">
          Filter efter genre:
        </h3>
        <SearchFilterLineup setFilter={setFilter} />
      </div>
      <div className="flex gap-2 flex-wrap justify-center">
        {genres.map((genre) => (
          <label
            key={genre}
            className="genre-label border-2 bg-background text-mid border-black  p-2 text-center w-fit text-black cursor-pointer"
          >
            <input
              type="checkbox"
              value={genre}
              onChange={handleCheckboxChange}
              className="sr-only"
            />
            {genre}
          </label>
        ))}
        <button
          onClick={resetGenres}
          className="p-2 bg-green  border-black border-2  font-semibold text-black text-xl "
        >
          Nulstil genrer
        </button>
      </div>
    </div>
  );
};

export default GenreFilter;

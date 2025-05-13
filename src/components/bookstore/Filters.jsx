import { useState } from 'react';

const Filters = ({ onFilter }) => {
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [selectedGenres, setSelectedGenres] = useState([]);

  const handleGenreChange = (genre) => {
    const newGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter(g => g !== genre)
      : [...selectedGenres, genre];
    setSelectedGenres(newGenres);
  };

  const handleApplyFilters = () => {
    // Passing the filter parameters to the parent component (Bookstore)
    onFilter({
      genres: selectedGenres,
      maxPrice: priceRange[1]
    });
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="mb-4">
        <h3 className="font-bold mb-2">Price Range</h3>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={priceRange[1]}
          onChange={(e) => setPriceRange([priceRange[0], e.target.value])}
          className="w-full"
        />
        <div className="flex justify-between text-sm">
          <span>$0</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-bold mb-2">Genres</h3>
        {['Fiction', 'Romance', 'Science', 'Mystery','Biography'].map(genre => (
          <label key={genre} className="block mb-2">
            <input
              type="checkbox"
              checked={selectedGenres.includes(genre)}
              onChange={() => handleGenreChange(genre)}
              className="mr-2"
            />
            {genre}
          </label>
        ))}
      </div>

      <button onClick={handleApplyFilters} className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
        Apply Filters
      </button>
    </div>
  );
};

export default Filters;

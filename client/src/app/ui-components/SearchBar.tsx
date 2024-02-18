import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';

interface SearchBarProps {
  placeholder: string;
  onSearch: (query: string) => void;
  debounceDelay?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onSearch, debounceDelay = 300 }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, debounceDelay);

    return () => {
      clearTimeout(timer);
    };
  }, [query, onSearch, debounceDelay]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="border text-black border-black rounded-md py-2 px-4 mr-2 focus:outline-none focus:border-blue-500"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;

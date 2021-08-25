import React from "react";

export default function LocalSearch({ keyword, setKeyword }) {
  const handleSearch = async (e) => {
    e.preventDefault();
    setKeyword(e.target.value.toLowerCase());
  };

  return (
    <input
      type="search"
      placeholder="Filter"
      value={keyword}
      onChange={handleSearch}
      className="form-control mb-4"
    />
  );
}

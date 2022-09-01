import React, { useState } from "react";
// import SearchIcon from "@material-ui/icons/Search";
// import CloseIcon from "@material-ui/icons/Close";

function SearchBar({ placeholder, entry, stateChanger, filter, ...rest }) {
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    filter(event.target.value.toLowerCase());
    setWordEntered(searchWord);
    const newFilter = entry.filter((value) => {
      return (value.properties.name + value.properties.description)
        .toLowerCase()
        .includes(searchWord.toLowerCase());
    });

    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
    filter("");
  };

  return (
    <div className="search">
      <div className="searchInputs">
        <input
          type="text"
          placeholder={placeholder}
          value={wordEntered}
          onChange={handleFilter}
        />
        <div className="searchIcon">
          {wordEntered.length === 0 ? (
            // (
            //   <SearchIcon />
            // ) : (
            //   <CloseIcon id="clearBtn" onClick={clearInput} />
            // )
            <button className="searchBar">
              <img
                className="searchBar"
                src="searchIcon.svg"
                alt="searchIcon"
              />
            </button>
          ) : (
            <button className="searchBar" id="clearBtn" onClick={clearInput}>
              <img className="searchBar" src="crossIcon.svg" alt="searchIcon" />
            </button>
          )}
        </div>
      </div>
      {filteredData.length !== 0 && (
        <ul className="dataResult">
          {" "}
          <p className="info"> cliquez pour voir </p>
          {filteredData.map((value, key) => {
            return (
              <button
                key={key}
                className="dataItem"
                onClick={() => {
                  stateChanger(
                    value.geometry.coordinates
                      ? [
                          value.geometry.coordinates[1] - 0.0015,
                          value.geometry.coordinates[0],
                          16,
                        ]
                      : [50.8571, 1.9473, 10]
                  );
                }}
              >
                <p>{value.properties.name}</p>
              </button>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;

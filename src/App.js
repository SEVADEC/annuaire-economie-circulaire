import React, { useState } from "react";
import { Map, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import L from "leaflet";
import parse from "html-react-parser";
import Hyperlink from "react-native-hyperlink";

import Logo from "./components/Logo";
import SearchBar from "./components/SearchBar";
import Contact from "./components/ContactText";

import Directory from "./data/DirectoryData.json";
import AllCategory from "./data/AllCategory.json";
import Territory from "./data/Territory.json";

const data = Directory.features;
const update = Directory.update;
const radios = AllCategory.name;

const fillOptions = { fillColor: "blue" };

let territoryPosition = [];

for (const eachPos of Territory.features[0].geometry.coordinates[0]) {
  territoryPosition.push([eachPos[1], eachPos[0]]);
}

// let numberCategory = [];

// for (const category of radios) {
//   let i = 0;
//   for (const element of data) {
//     if (element.properties.description.includes(category)) {
//       i++;
//     }
//   }
//   numberCategory.push(i);
// }

function App() {
  const [selectedRadio, setSelectedRadio] = useState("");
  const [position, setPosition] = useState([50.8571, 1.9473, 10]);
  const [filterEntry, setFilterEntry] = useState("");
  const [showList, setShowList] = useState(false);
  const [showContact, setShowContact] = useState(false);

  return (
    <div className="app">
      <Logo />
      <SearchBar
        placeholder="Recherche"
        entry={data}
        stateChanger={setPosition}
        filter={setFilterEntry}
      />
      <ul className="radio-container">
        {radios.map((category, index) => (
          <li key={index}>
            <button
              className="button-category"
              style={{
                color: category === selectedRadio ? "rgb(0, 51, 99)" : "",
              }}
              htmlFor={category}
              id={category}
              onClick={(e) =>
                selectedRadio === e.target.id
                  ? setSelectedRadio("")
                  : setSelectedRadio(e.target.id)
              }
            >
              <img
                className="logo-category"
                src={index + 1 + ".png"}
                alt={category}
              />{" "}
              {category}
              {/* <sup className="numberCategory">{numberCategory[index]}</sup> */}
            </button>
          </li>
        ))}
      </ul>
      <button
        className="showcontact"
        onClick={() => {
          setShowContact(!showContact);
        }}
      >
        {" "}
        <p className="contact">
          <img
            src={!showContact ? "contactIcon1.png" : "contactIcon2.png"}
            alt="contactIcon"
          ></img>
        </p>
      </button>
      {!showContact ? "" : <Contact className="popup" />}
      <button
        className="showList"
        onClick={() => {
          setShowList(!showList);
        }}
      >
        {" "}
        <p>
          <img
            className="logo-liste"
            src={!showList ? "./liste.png" : "./carte.png"}
            alt="logo liste"
          ></img>
          {/* {!showList ? "Afficher la liste" : "Afficher la carte"} */}
        </p>{" "}
      </button>
      {!showList ? (
        <Map
          center={[position[0], position[1]]}
          zoom={position[2]}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors <a href="https://www.sevadec.fr/">SEVADEC</a> {update}'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polygon pathOptions={fillOptions} positions={territoryPosition} />
          {data
            .filter((marker) =>
              marker.properties.description.includes(selectedRadio)
            )
            .filter((marker) =>
              (marker.properties.description + marker.properties.name)
                .toLowerCase()
                .includes(filterEntry)
            )
            .filter((marker) =>
              marker.geometry.coordinates ? marker.geometry.coordinates : ""
            )
            .map((marker, index) => (
              <Marker
                key={index}
                position={[
                  marker.geometry.coordinates[1],
                  marker.geometry.coordinates[0],
                ]}
                icon={
                  new L.icon({
                    iconUrl: "defaultLogo.png",
                    // marker.properties.logo === ""
                    //   ? "defaultLogo.png"
                    //   : marker.properties.logo + ".png",
                    iconSize: [25, 39],
                    iconAnchor: [10, 41],
                    popupAnchor: [2, -40],
                  })
                }
              >
                <Popup>
                  <span className="dashicons dashicons-admin-tools" />
                  <strong>{marker.properties.name}</strong>
                  <p />
                  <Hyperlink
                    linkDefault={true}
                    linkStyle={{ color: "#2980b9", fontSize: 11 }}
                  >
                    {parse(marker.properties.description)}
                  </Hyperlink>
                </Popup>
              </Marker>
            ))}
        </Map>
      ) : (
        <ul className="list">
          {data
            .filter((marker) =>
              marker.properties.description.includes(selectedRadio)
            )
            .filter(
              (marker) =>
                (marker.properties.description + marker.properties.name)
                  .toLowerCase()
                  .includes(filterEntry) ||
                marker.properties.name.toLowerCase().includes(filterEntry)
            )
            .map((marker, index) => (
              <li className="list" key={index}>
                <span className="dashicons dashicons-admin-tools" />
                <strong>{marker.properties.name}</strong>
                <p />
                <Hyperlink
                  linkDefault={true}
                  linkStyle={{ color: "#2980b9", fontSize: 15 }}
                >
                  {parse(marker.properties.description)}
                </Hyperlink>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

export default App;

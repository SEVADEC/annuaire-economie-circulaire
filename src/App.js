// Importation des bibliothèques et des fichiers de données nécessaires pour l'application
import React, {
  useState,
  // , useRef
} from "react";
import { Map, TileLayer, Marker, Popup, Polygon } from "react-leaflet"; // bibliothèque pour la création de cartes interactives
import L from "leaflet"; // bibliothèque de visualisation des cartes
import parse from "html-react-parser"; // bibliothèque pour analyser et interpréter du HTML en utilisant React
import Hyperlink from "react-native-hyperlink"; // bibliothèque pour créer des liens dans l'application

import Logo from "./components/Logo"; // composant pour afficher le logo de l'application
import SearchBar from "./components/SearchBar"; // composant pour afficher la barre de recherche
import Contact from "./components/ContactText"; // composant pour afficher le texte de contact

import Directory from "./data/DirectoryData.json"; // fichier de données pour la liste des points d'intérêt
import AllCategory from "./data/AllCategory.json"; // fichier de données pour les catégories de points d'intérêt
import Territory from "./data/Territory.json"; // fichier de données pour les contours du territoire
// import AllCity from "./data/AllCity.json";

// Initialisation des données
const data = Directory.features; // liste des points d'intérêt
const update = Directory.update; // date de la dernière mise à jour des données
const radios = AllCategory.name; // catégories de points d'intérêt
// const cityData = AllCity.features;

// Options pour remplir les polygones sur la carte
const fillOptions = { fillColor: "blue" };

function App() {
  // Initialisation des états
  const [selectedRadio, setSelectedRadio] = useState(""); // catégorie sélectionnée
  const [position, setPosition] = useState([50.8571, 1.9473, 10]); // position de départ de la carte
  const [filterEntry, setFilterEntry] = useState(""); // filtre de recherche
  const [showList, setShowList] = useState(false); // affichage sous forme de liste des points d'intérêt
  const [showContact, setShowContact] = useState(false); // affichage du texte de contact
  // const [popUpEvent, setPopUpEvent] = useState(false);

  return (
    <div className="app">
      <Logo /> {/* Affichage du logo de l'application */}
      <SearchBar
        // Barre de recherche pour filtrer les points d'intérêt
        placeholder="Recherche : Mot-clé, Entreprise..."
        entry={data}
        stateChanger={setPosition}
        // stateChangerPopUp={setPopUpEvent}
        filter={setFilterEntry}
      />
      <ul className="radio-container">
        {/* Liste des boutons pour sélectionner une catégorie de points d'intérêt */}
        {radios.map((category, index) => (
          <li key={index}>
            <button
              className="button-category"
              style={{
                "background-color":
                  category === selectedRadio ? " rgb(37, 204, 162)" : "",
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
                //image correspondante à chaque catégorie
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
          setShowContact(!showContact); // basculer l'état pour afficher/masquer le composant de contact
        }}
        style={{
          "background-color": showContact ? " rgb(37, 204, 162)" : "",
        }}
      >
        {" "}
        <p className="contact">
          <img
            src={"contactIcon1.png"}
            // src={!showContact ? "contactIcon1.png" : "contactIcon2.png"}
            alt="contactIcon"
          ></img>
        </p>
      </button>
      {!showContact ? "" : <Contact className="popup" />}
      <button
        className="showList"
        onClick={() => {
          setShowList(!showList); // bascule l'état pour afficher/masquer la liste
        }}
        style={{
          "background-color": showList ? " rgb(37, 204, 162)" : "",
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
        <Map // Composant cartographique de react-leaflet
          center={[position[0], position[1]]} // position centrale initiale de la carte
          zoom={position[2]} // niveau de zoom initial de la carte
          scrollWheelZoom={true} // activer/désactiver le zoom avec la molette de défilement
        >
          <TileLayer // Composant TileLayer de la notice de réaction
            attribution={
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors <a href="https://www.sevadec.fr/">SEVADEC</a> - ' +
              update
            }
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {Territory.features.map((polygon) => {
            // Inverser les coordonnées de chaque polygone
            const invertedCoordinates = polygon.geometry.coordinates[0].map(
              ([lng, lat, alt]) => [lat, lng, alt]
            );

            // Rendre le polygone avec les coordonnées inversées
            return (
              <Polygon
                pathOptions={fillOptions}
                positions={[invertedCoordinates]}
              />
            );
          })}
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
            // Afficher un marqueur pour chaque élément filtré
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
        // Si showList est true, afficher une liste
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
            // Afficher un élément de la liste pour chaque élément filtré
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

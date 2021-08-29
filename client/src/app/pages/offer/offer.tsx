import "./offer.scss";
import { useState } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import { Select, Button, MapMarkerIcon, TextInput } from "evergreen-ui";
//@ts-expect-error
import AlgoliaPlaces from "algolia-places-react";
import { PolylineOverlay } from "./PloyLineOverlay";
import { useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Address = {
  address: string;
  latitude: string;
  longitude: string;
};

export const Offer = () => {
  const [fromAddress, setFromAddress] = useState<Address>();
  const [toAddress, setToAddress] = useState<Address>();
  const [selectedSeats, setSelectedSeats] = useState(1);
  const [costPerKm, setCostPerKm] = useState(0.1);
  const [routeJSON, setRouteJSON] = useState([]);
  const [startDate, setStartDate] = useState(new Date());

  const getOptimizedRoute = () => {
    if (!fromAddress || !toAddress) {
      return;
    }
    const coordinates = `${fromAddress.longitude},${fromAddress.latitude};${toAddress.longitude},${toAddress.latitude}`;
    fetch(
      `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordinates}?&overview=full&steps=true&geometries=geojson&source=first&access_token=${process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.trips.length > 0) {
          setRouteJSON(data.trips[0].geometry.coordinates);
        } else {
          setRouteJSON([]);
        }
      });
  };

  const [viewport, setViewport] = useState({
    width: "100%",
    height: "100vh",
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 10,
  });

  useEffect(() => {
    getOptimizedRoute();
  }, [fromAddress, toAddress]);

  return (
    <div className="offer_map__view">
      <div className="ride__selection">
        <div className="head">
          <h3>Offer a ride</h3>
          <p>From</p>
          <AlgoliaPlaces
            placeholder="From"
            options={{
              appId: process.env.REACT_APP_APP_ID,
              apiKey: process.env.REACT_APP_ALGOLIA_API,
              language: "sv",
            }}
            onChange={({ suggestion }: any) => {
              setFromAddress({
                address: suggestion.value,
                latitude: suggestion.latlng.lat,
                longitude: suggestion.latlng.lng,
              });
              setViewport({
                ...viewport,
                latitude: suggestion.latlng.lat,
                longitude: suggestion.latlng.lng,
              });
            }}
          />
          <p>To</p>
          <AlgoliaPlaces
            placeholder="To"
            options={{
              appId: process.env.REACT_APP_APP_ID,
              apiKey: process.env.REACT_APP_ALGOLIA_API,
              language: "sv",
            }}
            onChange={({ suggestion }: any) =>
              setToAddress({
                address: suggestion.value,
                latitude: suggestion.latlng.lat,
                longitude: suggestion.latlng.lng,
              })
            }
          />
          <p>Date</p>
          <DatePicker
            className="input__date"
            selected={startDate}
            onChange={(date) => setStartDate(date as Date)}
          />
          <p>Cost Per Km (Sol)</p>
          <TextInput
            value={costPerKm}
            onChange={(e: any) => setCostPerKm(e.target.value)}
            type="number"
            className="input"
            width="100%"
            height={40}
            borderWidth={1}
            borderColor="#ccc"
            fontSize={16}
            fontWeight={400}
            placeholder="Cost per km"
          />
          <p>Seats</p>
          <Select
            onChange={(event) =>
              setSelectedSeats(parseInt(event.target.value, 10))
            }
          >
            <option value="1" selected>
              1
            </option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </Select>
        </div>
        {
          <Button
            disabled={
              !fromAddress || !toAddress || !selectedSeats || !costPerKm
            }
            className="find__ride"
            onClick={() => {}}
          >
            Add Ride
          </Button>
        }
      </div>
      <div className="map">
        <ReactMapGL
          {...viewport}
          onViewportChange={(nextViewport: any) => setViewport(nextViewport)}
          mapStyle="mapbox://styles/mapbox/streets-v11"
        >
          {routeJSON.length > 0 && <PolylineOverlay points={routeJSON} />}
          {fromAddress && (
            <Marker
              latitude={parseFloat(fromAddress.latitude)}
              longitude={parseFloat(fromAddress.longitude)}
            >
              <div className="car" />
            </Marker>
          )}
          {toAddress && (
            <Marker
              latitude={parseFloat(toAddress.latitude)}
              longitude={parseFloat(toAddress.longitude)}
            >
              <MapMarkerIcon color="#cf1c08" size={20} />
            </Marker>
          )}
        </ReactMapGL>
      </div>
    </div>
  );
};

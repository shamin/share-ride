import "./offer.scss";
import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import {
  Select,
  Button,
  MapMarkerIcon,
  TextInput,
  CornerDialog,
} from "evergreen-ui";
//@ts-expect-error
import AlgoliaPlaces from "algolia-places-react";
import { PolylineOverlay } from "./PolyLineOverlay";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useHistory } from "react-router-dom";
import { useShareRide } from "../../web3/provider";
import { config } from "../../../config";

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

  const { wallet, shareRideState } = useShareRide();
  const walletKey = wallet?.publicKey?.toBase58();

  const {
    addDriver,
    loadDrivers,
    loading,
    showCompleteModal,
    setShowCompleteModal,
  } = shareRideState;

  const history = useHistory();

  useEffect(() => {
    loadDrivers();
    return () => {
      setShowCompleteModal(false)
    }
  }, []);

  const getOptimizedRoute = () => {
    if (!fromAddress || !toAddress) {
      return;
    }
    const coordinates = `${fromAddress.longitude},${fromAddress.latitude};${toAddress.longitude},${toAddress.latitude}`;
    fetch(
      `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordinates}?&overview=full&steps=true&geometries=geojson&source=first&access_token=${config.MAPBOX_ACCESS_TOKEN}`
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
  }, [JSON.stringify(fromAddress), JSON.stringify(toAddress)]);

  const driver = {
    fromAddress,
    toAddress,
    selectedSeats,
    costPerKm,
    startDate,
    walletKey,
  };

  return (
    <div className="offer_map__view">
      <CornerDialog
        intent="success"
        title="Ride Added"
        isShown={showCompleteModal}
        confirmLabel="Show Rides"
        onConfirm={() => history.push("/")}
        onCloseComplete={() => setShowCompleteModal(false)}
      >
        Hooray!, Your ride is successfully added
      </CornerDialog>
      <div className="ride__selection">
        <div className="head">
          <h3>Offer a ride</h3>
          <p>From</p>
          <AlgoliaPlaces
            placeholder="From"
            options={{
              appId: config.APP_ID,
              apiKey: config.ALGOLIA_API,
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
              appId: config.APP_ID,
              apiKey: config.ALGOLIA_API,
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
          <p>Cost/km (sherekhan)</p>
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
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </Select>
        </div>
        {
          <Button
            isLoading={loading}
            disabled={
              !fromAddress || !toAddress || !selectedSeats || !costPerKm
            }
            className="find__ride"
            onClick={() => {
              addDriver(driver);
            }}
          >
            Add Ride
          </Button>
        }
      </div>
      <div className="map">
        <ReactMapGL
          {...viewport}
          mapboxApiAccessToken={config.MAPBOX_ACCESS_TOKEN}
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

import "./ride.scss";
import React, { useState, useEffect } from "react"; 
import ReactMapGL, { Marker } from "react-map-gl";
import { Select, Button, MapMarkerIcon, CornerDialog } from "evergreen-ui";
//@ts-expect-error
import AlgoliaPlaces from "algolia-places-react";
import { PolylineOverlay } from "./PolyLineOverlay";
import { RidersModal } from "./Riders";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { findDrivers } from "./utils";
import { useHistory } from "react-router-dom";
import { useShareRide } from "../../web3/provider";
import { config } from "../../../config";
import { Address, Driver } from "../../web3/provider/state";

const COST_PER_KM = 0.1;

export const Ride = () => {
  const [fromAddress, setFromAddress] = useState<Address>();
  const [toAddress, setToAddress] = useState<Address>();
  const [routeDistance, setRouteDistance] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState(1);
  const [routeJSON, setRouteJSON] = useState([]);
  const [showDrivers, setShowDrivers] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [matchingDivers, setMatchingDrivers] = useState<Driver[]>([]);
  
  const { wallet, shareRideState } = useShareRide();
  const walletKey = wallet?.publicKey?.toBase58();

  const {
    drivers,
    loadDrivers,
    loadRides,
    addRide,
    setShowCompleteModal,
    showCompleteModal,
  } = shareRideState;

  useEffect(() => {
    loadDrivers();
    loadRides();
    return () => {
      setShowCompleteModal(false)
    }
  }, []);

  const history = useHistory();

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
        console.log("Data", data)
        if (data.trips.length > 0) {
          setRouteJSON(data.trips[0].geometry.coordinates);
          setRouteDistance(data.trips[0].distance / 1000);
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
    if (fromAddress && toAddress) {
      const m = findDrivers({ fromAddress, toAddress, startDate }, drivers).filter((d) => d.walletKey !== walletKey);
      setMatchingDrivers(m);
    }
  }, [fromAddress, toAddress, startDate]);

  const cost = COST_PER_KM * selectedSeats * routeDistance;

  return (
    <div className="map__view">
      <CornerDialog
        intent="success"
        title="Ride Booked"
        isShown={showCompleteModal}
        confirmLabel="Show Rides"
        onConfirm={() => history.push("/")}
        onCloseComplete={() => setShowCompleteModal(false)}
      >
        Hooray!, Your ride is successfully booked
      </CornerDialog>
      <RidersModal
        onDriverClicked={(d: any) => {
          const ride = {
            ...d,
            driver: d.walletKey,
            riderKey: walletKey,
            totalCost: Math.ceil(d.costPerKm * routeDistance * selectedSeats),
            driveId: d.archiveId
          };
          addRide(ride);
          setShowDrivers(false);
        }}
        seatsRequired={selectedSeats}
        distance={routeDistance}
        drivers={matchingDivers}
        show={showDrivers}
        onClose={() => setShowDrivers(false)}
      />
      <div className="ride__selection">
        <div className="head">
          <h3>Find a ride</h3>
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
            className="input"
            selected={startDate}
            onChange={(date) => setStartDate(date as Date)}
          />

          <p>Seats</p>
          <Select
            onChange={(event) =>
              setSelectedSeats(parseInt(event.target.value, 10))
            }
          >
            <option value="1">
              1
            </option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </Select>
          {!!cost && (
            <div>
              <h3>Estimated Cost</h3>
              <p>{Math.ceil(cost)} sherekhan</p>
            </div>
          )}
        </div>
          <Button
            disabled={!cost}
            className="find__ride"
            onClick={() => setShowDrivers(true)}
          >
            Find Ride
          </Button>
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
              latitude={fromAddress.latitude}
              longitude={fromAddress.longitude}
            >
              <div className="car" />
            </Marker>
          )}
          {toAddress && (
            <Marker
              latitude={toAddress.latitude}
              longitude={toAddress.longitude}
            >
              <MapMarkerIcon color="#cf1c08" size={20} />
            </Marker>
          )}
        </ReactMapGL>
      </div>
    </div>
  );
};

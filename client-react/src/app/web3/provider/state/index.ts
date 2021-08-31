import React, { useMemo, useRef, useState } from "react";
import { ShareRideModel } from "./model";
import { Provider } from "@project-serum/anchor";

interface Driver {}

interface Ride {}

export interface ShareRideState {
  drivers: Driver[];
  rides: Ride[];
  loadDrivers: () => Promise<void>;
  loadRides: () => Promise<void>;
  showCompleteModal: boolean;
  setShowCompleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  addDriver: (driver: any) => Promise<void>;
  addRide: (ride: any) => Promise<void>;
  loading: boolean;
}

export const useShareRideState = (provider?: Provider): ShareRideState => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [rides, setRides] = useState<Ride[]>([]);

  const [loading, setLoading] = useState(false);
  const [driversLoading, setDriversLoading] = useState(false);
  const [ridesLoading, setRidesLoading] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const shareRiderModel = useMemo(() => {
    if(provider) {
      return new ShareRideModel(provider)
    }
  }, [provider])

  const loadDrivers = async () => {
    if(!shareRiderModel) {
      return
    }
    if (driversLoading) {
      return;
    }
    setDriversLoading(true);
    try {
      const drivers = await shareRiderModel.getActiveDrivers();
      setDrivers(drivers);
    } catch (err) {
      console.log("Error loading drivers");
    }
    setDriversLoading(false);
  };

  const loadRides = async () => {
    if(!shareRiderModel) {
      return
    }
    if (ridesLoading) {
      return;
    }
    setRidesLoading(true);
    try {
      const rides = await shareRiderModel.getActiveRides();
      setRides(rides);
    } catch (err) {
      console.log("Error loading drivers");
    }
    setRidesLoading(false);
  };

  const addDriver = async (driver: any) => {
    if(!shareRiderModel) {
      return
    }
    setLoading(true);
    await shareRiderModel.addDrivers(driver);
    await loadDrivers();
    setLoading(false);
    setShowCompleteModal(true);
  };

  const addRide = async (ride: any) => {
    if(!shareRiderModel) {
      return
    }
    setLoading(true);
    await shareRiderModel.addRides(ride);
    await loadRides();
    setLoading(false);
    setShowCompleteModal(true);
  };

  return {
    drivers,
    rides,
    loadDrivers,
    loadRides,
    showCompleteModal,
    setShowCompleteModal,
    addDriver,
    addRide,
    loading,
  };
};

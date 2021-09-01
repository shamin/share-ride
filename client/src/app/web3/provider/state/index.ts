import React, { useEffect, useMemo, useRef, useState } from "react";
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

  const shareRideModelRef = useRef<ShareRideModel>();

  const initializeShareRideModel = async (provider: Provider) => {
    const _shareRideModel = new ShareRideModel(provider);
    const data = await _shareRideModel.initialize();
    setDrivers(data.drivers);
    setRides(data.rides);
    shareRideModelRef.current = _shareRideModel;
  };

  useEffect(() => {
    if (provider && !shareRideModelRef.current) {
      console.log("Initing share ride model");
      initializeShareRideModel(provider);
    }
  }, [provider]);

  const loadDrivers = async () => {
    console.log("Loading drivers", shareRideModelRef.current);
    if (!shareRideModelRef.current) {
      return;
    }
    if (driversLoading) {
      return;
    }
    setDriversLoading(true);
    try {
      const drivers = await shareRideModelRef.current.getActiveDrivers();
      setDrivers(drivers);
    } catch (err) {
      console.log("Error loading drivers", err);
    }
    setDriversLoading(false);
  };

  const loadRides = async () => {
    if (!shareRideModelRef.current) {
      return;
    }
    if (ridesLoading) {
      return;
    }
    setRidesLoading(true);
    try {
      const rides = await shareRideModelRef.current.getActiveRides();
      setRides(rides);
    } catch (err) {
      console.log("Error loading drivers");
    }
    setRidesLoading(false);
  };

  const addDriver = async (driver: any) => {
    if (!shareRideModelRef.current) {
      return;
    }
    setLoading(true);
    await shareRideModelRef.current.addDrivers(driver);
    await loadDrivers();
    setLoading(false);
    setShowCompleteModal(true);
  };

  const addRide = async (ride: any) => {
    if (!shareRideModelRef.current) {
      return;
    }
    setLoading(true);
    await shareRideModelRef.current.addRides(ride);
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

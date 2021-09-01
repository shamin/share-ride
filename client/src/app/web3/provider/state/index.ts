import React, { useEffect, useMemo, useRef, useState } from "react";
import { ShareRideModel } from "./model";
import { Provider } from "@project-serum/anchor";
import { AccountInfo } from "@solana/spl-token";
import { intializeEscrow } from "../account/escrow";

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

export const useShareRideState = (
  provider: Provider | undefined,
  tokenAccount: AccountInfo | undefined,
  setLoadingText: React.Dispatch<React.SetStateAction<string>>
): ShareRideState => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [rides, setRides] = useState<Ride[]>([]);

  const [loading, setLoading] = useState(false);
  const [driversLoading, setDriversLoading] = useState(false);
  const [ridesLoading, setRidesLoading] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const shareRideModelRef = useRef<ShareRideModel>();

  const initializeShareRideModel = async (provider: Provider) => {
    setLoadingText("Loading...")
    const _shareRideModel = new ShareRideModel(provider);
    const data = await _shareRideModel.initialize();
    setDrivers(data.drivers);
    setRides(data.rides);
    setLoadingText("")
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
    setLoadingText("Loading rides")
    try {
      const drivers = await shareRideModelRef.current.getActiveDrivers();
      setDrivers(drivers);
    } catch (err) {
      console.log("Error loading drivers", err);
    }
    setLoadingText("")
  };

  const loadRides = async () => {
    if (!shareRideModelRef.current) {
      return;
    }
    if (ridesLoading) {
      return;
    }
    setLoadingText("Loading rides")
    try {
      const rides = await shareRideModelRef.current.getActiveRides();
      setRides(rides);
    } catch (err) {
      console.log("Error loading drivers");
    }
    setLoadingText("")
  };

  const addDriver = async (driver: any) => {
    setLoadingText("Offering a ride")
    if (!shareRideModelRef.current) {
      return;
    }
    await shareRideModelRef.current.addDrivers(driver);
    await loadDrivers();
    setLoadingText("")
    setShowCompleteModal(true);
  };

  const addRide = async (ride: any) => {
    console.log(!shareRideModelRef.current, !provider, !tokenAccount);
    setLoadingText("Accepting a ride")
    if (!shareRideModelRef.current || !provider || !tokenAccount) {
      // TODO: Handle this in the future - no_mvp
      return;
    }
    console.log(ride);
    if (provider && tokenAccount) {
      const escrow = await intializeEscrow(
        provider,
        tokenAccount,
        ride.totalCost,
        ride.walletKey
      );
      if (!shareRideModelRef.current) {
        return;
      }
      await shareRideModelRef.current.addRides({
        ...ride,
        escrow,
      });
      await loadRides();
      setShowCompleteModal(true);
    }
    setLoadingText("")
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

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ShareRideModel } from "./model";
import { Provider } from "@project-serum/anchor";
import { AccountInfo } from "@solana/spl-token";
import { intializeEscrow } from "../account/escrow";

export type Address = {
  address: string;
  latitude: number;
  longitude: number;
};

export interface Driver {
  archiveId: string;
  fromAddress: Address;
  toAddress: Address;
  startDate: string;
  driver: string;
  riderKey: string;
  costPerKm: number;
  selectedSeats: number;
  walletKey: string;
}

export interface Ride {
  archiveId: string;
  fromAddress: Address;
  toAddress: Address;
  startDate: string;
  driver: string;
  riderKey: string;
  driveId: string;
  escrow: string;
  selectedSeats: number;
}

export interface ShareRideState {
  drivers: Driver[];
  rides: Ride[];
  loadDrivers: () => Promise<void>;
  loadRides: () => Promise<void>;
  showCompleteModal: boolean;
  setShowCompleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  addDriver: (driver: any) => Promise<void>;
  addRide: (ride: any) => Promise<void>;
  removeDriver: (archive: string) => Promise<void>;
}

export const useShareRideState = (
  provider: Provider | undefined,
  tokenAccount: AccountInfo | undefined,
  setLoadingText: (loadingText: string) => void
): ShareRideState => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [rides, setRides] = useState<Ride[]>([]);

  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const shareRideModelRef = useRef<ShareRideModel>();

  const initializeShareRideModel = async (provider: Provider) => {
    setLoadingText("Loading...")
    const _shareRideModel = new ShareRideModel(provider);
    const data = await _shareRideModel.initialize();
    setDrivers(data.drivers as Driver[]);
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
    setLoadingText("Loading rides")
    try {
      const drivers = await shareRideModelRef.current.getActiveDrivers() as Driver[];
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

  const removeDriver = async (archiveId: string) => {
    if (!shareRideModelRef.current) {
      return;
    }
    setLoadingText("Marking ride as complete")
    await shareRideModelRef.current.removeDriver(archiveId);
    await loadRides();
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
    removeDriver,
  };
};

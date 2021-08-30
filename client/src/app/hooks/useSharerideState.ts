import { useRef, useState } from "react";
import { StateSolana } from "../../web3/state";
import arweaveService, { Driver } from "../../web3/arweave/arweave";

const DUMMY_TX_ID = "___________________________________________";

export const useSharerideState = () => {
  const [drivers, setDrivers] = useState<any>([]);
  const [rides, setRides] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [driversLoading, setDriversLoading] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const solanaStateServices = useRef(new StateSolana());

  const getDrivers = async () => {
    if (driversLoading) {
      return;
    }
    try {
      setDriversLoading(true);
      const drivers = await solanaStateServices.current.getDrivers();
      console.log(drivers);
      const filteredDrivers = (drivers as Driver[]).filter(
        ({ archive }: any) => archive !== DUMMY_TX_ID
      );
      console.log(filteredDrivers);
      const driverData = await arweaveService.getData(filteredDrivers);
      console.log(driverData);
      setDrivers(driverData);
      setDriversLoading(false);
    } catch (err) {
      console.log("Error loading drivers");
    }
  };

  const getRides = async () => {
    try {
      const drivers = await solanaStateServices.current.getRides();
      const filteredRides = (drivers as Driver[]).filter(
        ({ archive }: any) => archive !== DUMMY_TX_ID
      );
      const ridesData = await arweaveService.getData(filteredRides);
      console.log(ridesData);
      setRides(ridesData);
    } catch (err) {
      console.log("Error loading drivers");
    }
  };

  const addDriver = async (driver: any) => {
    setLoading(true);
    await solanaStateServices.current.addDrivers(driver);
    await getDrivers();
    setLoading(false);
    setShowCompleteModal(true);
  };

  const addRide = async (ride: any) => {
    setLoading(true);
    await solanaStateServices.current.addRides(ride);
    await getRides();
    setLoading(false);
    setShowCompleteModal(true);
  };

  return {
    getDrivers,
    drivers,
    addDriver,
    showCompleteModal,
    setShowCompleteModal,
    loading,
    getRides,
    addRide,
    rides,
  };
};

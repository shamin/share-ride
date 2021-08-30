import { useRef, useState } from "react";
import { DriversSolana } from "../../web3/driver";
import arweaveService, { Driver } from "../../web3/arweave/arweave";

const DUMMY_TX_ID = "___________________________________________"

export const useDrivers = () => {
  const [drivers, setDrivers] = useState<any>([]);
  const driverServices = useRef(new DriversSolana());

  const getDrivers = async () => {
    try {
      const drivers = await driverServices.current.getDrivers();
      const filteredDrivers = (drivers as Driver[]).filter(({archive}: any) => archive !== DUMMY_TX_ID)
      const driverData = await arweaveService.getData(filteredDrivers);
      console.log(driverData);
      setDrivers(drivers as any);
    } catch (err) {
      console.log("Error loading drivers");
    }
  };

  const addDriver = async (driver: any) => {
    await driverServices.current.addDrivers(driver);
    getDrivers();
  };

  return {
    getDrivers,
    drivers,
    addDriver,
  };
};

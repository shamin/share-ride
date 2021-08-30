import "./home.scss";
import { Table, Button } from "evergreen-ui";
import { useHistory } from "react-router-dom";
import { useSharerideState } from "../../hooks/useSharerideState";
import { useEffect } from "react";
import { getSolanaWallet } from "../../../web3/wallet";

const formatDate = (d: Date) => {
  let dd: string | number = d.getDate();
  let mm: string | number = d.getMonth() + 1;

  const yyyy = d.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  return dd + "/" + mm + "/" + yyyy;
};

const ridesData = [
  {
    id: 1,
    to: "Kochi",
    from: "Kattapana",
    date: new Date(),
    driver: "xyz",
    seats: 1,
  },
  {
    id: 2,
    to: "Kochi",
    from: "Kattapana",
    date: new Date(),
    driver: "xyz",
    seats: 2,
  },
  {
    id: 3,
    to: "Kochi",
    from: "Kattapana",
    date: new Date(),
    driver: "xyz",
    seats: 3,
  },
  {
    id: 4,
    to: "Kochi",
    from: "Kattapana",
    date: new Date(),
    driver: "xyz",
    seats: 4,
  },
];

export const Home = () => {
  const wallet = getSolanaWallet();
  const walletKey = wallet?.publicKey?.toBase58();
  const { drivers, getRides, rides = [], getDrivers } = useSharerideState();

  useEffect(() => {
    getDrivers();
    getRides();
  }, []);

  const myUpcomingRides = rides
    .filter(({ riderKey }: any) => riderKey === walletKey)
    .map(
      ({ fromAddress, toAddress, startDate, driver }: any, index: number) => ({
        id: index,
        from: fromAddress.address,
        to: toAddress.address,
        date: formatDate(new Date(startDate)),
        driver,
      })
    );

  const myRideOffers = drivers
    .filter(({ walletKey: w }: any) => w === walletKey)
    .map(
      (
        { fromAddress, toAddress, startDate, selectedSeats }: any,
        index: number
      ) => ({
        id: index,
        from: fromAddress.address,
        to: toAddress.address,
        seatsOffered: selectedSeats,
        date: formatDate(new Date(startDate)),
        riders: rides.map((r: any) => r.driverKey === walletKey),
      })
    );

  console.log(myUpcomingRides);
  console.log(myRideOffers);

  const history = useHistory();
  return (
    <div className="container__home">
      <div className="upcoming__rides">
        {myUpcomingRides.length > 0 && (
          <>
            <h3>Upcoming Rides</h3>
            <Table>
              <Table.Head>
                <Table.TextHeaderCell>From</Table.TextHeaderCell>
                <Table.TextHeaderCell>To</Table.TextHeaderCell>
                <Table.TextHeaderCell>Driver</Table.TextHeaderCell>
                <Table.TextHeaderCell>Date</Table.TextHeaderCell>
              </Table.Head>
              <Table.Body maxHeight={240}>
                {myUpcomingRides.map((ride: any) => (
                  <Table.Row key={ride.id} isSelectable>
                    <Table.TextCell>{ride.from}</Table.TextCell>
                    <Table.TextCell>{ride.to}</Table.TextCell>
                    <Table.TextCell>{ride.driver}</Table.TextCell>
                    <Table.TextCell isNumber>{ride.date}</Table.TextCell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </>
        )}
        {myRideOffers.length > 0 && (
          <>
            <h3>Upcoming Ride Offers</h3>
            <Table>
              <Table.Head>
                <Table.TextHeaderCell>From</Table.TextHeaderCell>
                <Table.TextHeaderCell>To</Table.TextHeaderCell>
                <Table.TextHeaderCell>Date</Table.TextHeaderCell>
                <Table.TextHeaderCell>Seats</Table.TextHeaderCell>
                <Table.TextHeaderCell>Riders Accepted</Table.TextHeaderCell>
                <Table.TextCell>Action</Table.TextCell>
              </Table.Head>
              <Table.Body maxHeight={240}>
                {myRideOffers.map((ride: any) => (
                  <Table.Row key={ride.id} isSelectable>
                    <Table.TextCell>{ride.from}</Table.TextCell>
                    <Table.TextCell>{ride.to}</Table.TextCell>
                    <Table.TextCell>{ride.date}</Table.TextCell>
                    <Table.TextCell isNumber>
                      {ride.seatsOffered}
                    </Table.TextCell>
                    <Table.TextCell isNumber>
                      {ride.riders.length}
                    </Table.TextCell>
                    <Table.TextCell>
                      <Button
                        onClick={() => {}}
                        appearance="primary"
                        disabled={formatDate(new Date()) !== ride.date}
                        intent="success"
                      >
                        Complete Ride
                      </Button>
                    </Table.TextCell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </>
        )}
      </div>
      <div>
        <h3>Get Started</h3>
        <Button onClick={() => history.push("/ride")} className="finde__ride">
          Find ride
        </Button>
        <Button onClick={() => history.push("/offer")} className="offer__ride">
          Offer ride
        </Button>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from "react";
import { Table, Button } from "evergreen-ui";
import { useHistory } from "react-router-dom";
import "./home.scss";
import { useShareRide } from "../../web3/provider";

type Ride = {
  id: string,
  from: string,
  to: string,
  date: string,
  driver: string,
}

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

export const Home = () => {
  const { wallet, shareRideState, completeRide } = useShareRide();
  const walletKey = wallet?.publicKey?.toBase58();
  console.log("Home", shareRideState?.drivers);

  useEffect(() => {
    if (wallet) {
      shareRideState.loadDrivers();
    }
  }, [wallet]);

  const myUpcomingRides = shareRideState.rides
    .filter(({ riderKey }) => riderKey === walletKey)
    .map(
      ({ fromAddress, toAddress, startDate, driver, archiveId, driveId }) => ({
        id: archiveId,
        from: fromAddress.address,
        to: toAddress.address,
        date: formatDate(new Date(startDate)),
        driver,
        driverData: shareRideState.drivers.filter(({ archiveId }) => driveId === archiveId)[0]
      })
    ).filter(({driverData}) => !!driverData);

  const myRideOffers = shareRideState.drivers
    .filter(({ walletKey: w }: any) => w === walletKey)
    .map(
      (
        { fromAddress, toAddress, startDate, selectedSeats, archiveId },
      ) => ({
        id: archiveId,
        from: fromAddress.address,
        to: toAddress.address,
        seatsOffered: selectedSeats,
        date: formatDate(new Date(startDate)),
        riders: shareRideState.rides.filter(({ driveId }) => driveId === archiveId),
      })
    );

  console.log("Ride offers & Upcoming rides", myRideOffers, myUpcomingRides)

  const history = useHistory();
  return (
    <div className="container__home">
      <div>
        <h3>Get Started</h3>
        <div className="get__started">
          <div
            onClick={() => history.push("/ride")}
            className="find__ride driver__card"
          >
            <div className="overlay" />
            <p>Find a ride</p>
          </div>
          <div
            onClick={() => history.push("/offer")}
            className="offer__ride driver__card"
          >
            <div className="overlay" />
            <p>Offer a ride</p>
          </div>
        </div>
      </div>
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
                {/* <Table.TextCell>Action</Table.TextCell> */}
              </Table.Head>
              <Table.Body maxHeight={240}>
                {myUpcomingRides.map((ride) => (
                  <Table.Row key={ride.id} isSelectable>
                    <Table.TextCell>{ride.from}</Table.TextCell>
                    <Table.TextCell>{ride.to}</Table.TextCell>
                    <Table.TextCell>{ride.driver}</Table.TextCell>
                    <Table.TextCell isNumber>{ride.date}</Table.TextCell>
                    {/* <Table.TextCell>
                      <Button
                        onClick={() => removeRide(ride.id)}
                        appearance="primary"
                        disabled={formatDate(new Date()) !== ride.date}
                        intent="danger"
                      >
                        Cancel Ride
                      </Button>
                    </Table.TextCell> */}
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
                        onClick={() => { 
                          completeRide(ride.id)
                        }}
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
    </div>
  );
};

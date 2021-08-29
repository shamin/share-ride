import "./home.scss";
import { Table, Button } from "evergreen-ui";
import { useHistory } from "react-router-dom";

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
  const history = useHistory();
  return (
    <div className="container__home">
      <div className="upcoming__rides">
        <h3>Upcoming Rides</h3>
        <Table>
          <Table.Head>
            <Table.TextHeaderCell>From</Table.TextHeaderCell>
            <Table.TextHeaderCell>Date</Table.TextHeaderCell>
            <Table.TextHeaderCell>Driver</Table.TextHeaderCell>
            <Table.TextHeaderCell>Seats</Table.TextHeaderCell>
          </Table.Head>
          <Table.Body height={240}>
            {ridesData.map((ride) => (
              <Table.Row
                key={ride.id}
                isSelectable
                onSelect={() => alert(ride.from)}
              >
                <Table.TextCell>{ride.to}</Table.TextCell>
                <Table.TextCell>{ride.date.toString()}</Table.TextCell>
                <Table.TextCell>{ride.driver}</Table.TextCell>
                <Table.TextCell isNumber>{ride.seats}</Table.TextCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      <div>
        <h3>Get Started</h3>
        <Button onClick={() => history.push('/ride')} className="finde__ride">Find ride</Button>
        <Button onClick={() => history.push('/offer')} className="offer__ride">Offer ride</Button>
      </div>
    </div>
  );
};

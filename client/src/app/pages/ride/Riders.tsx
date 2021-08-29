import { Pane, Dialog, Button, Table } from "evergreen-ui";
import React from "react";

type Driver = {
  address: string;
  seatsAvailable: number;
  costPerKm: number;
};
interface RiderModalProps {
  drivers?: Driver[];
  onDriverClicked: (driver: Driver) => void;
  distance?: number;
  show?: boolean;
  onClose: () => void;
  seatsRequired: number;
}

const sampleDrivers = [
  {
    address: "ee74676a-3eea-4ae1-90d7-56d4362fd9a8",
    seatsAvailable: 1,
    costPerKm: 1.6,
  },
  {
    address: "4ec7896b-edd6-45b1-8d37-b9099983cc0f",
    seatsAvailable: 3,
    costPerKm: 2.0,
  },
  {
    address: "c4374386-5cab-4432-9f4c-c3227fe4d8df",
    seatsAvailable: 3,
    costPerKm: 1.9,
  },
  {
    address: "aedce53c-7687-445e-917d-29de42845432",
    seatsAvailable: 4,
    costPerKm: 1.6,
  },
  {
    address: "c2d62145-4b79-43fd-89c4-1b0e9f459f3f",
    seatsAvailable: 1,
    costPerKm: 1.8,
  },
  {
    address: "711db5c3-b6e6-4b70-843b-5fffb079fefc",
    seatsAvailable: 1,
    costPerKm: 2.0,
  },
  {
    address: "2e1948b2-9067-4551-83a7-9fd0eaa55efe",
    seatsAvailable: 4,
    costPerKm: 1.7,
  },
  {
    address: "37ad4b6c-02ca-4726-ba2b-a4fbc2dce5ec",
    seatsAvailable: 1,
    costPerKm: 1.4,
  },
  {
    address: "fb66034c-df8a-4e3c-ab25-c0b4a761a9b1",
    seatsAvailable: 4,
    costPerKm: 1.8,
  },
  {
    address: "89717eb6-6aaf-4d6e-8b8b-596be58874b9",
    seatsAvailable: 4,
    costPerKm: 1.8,
  },
];

export const RidersModal: React.FC<RiderModalProps> = ({
  drivers = sampleDrivers,
  onDriverClicked,
  distance = 1,
  seatsRequired = 1,
  show,
  onClose,
}) => {
  return (
    <Dialog
      isShown={show}
      title="Select Driver"
      onCloseComplete={() => onClose()}
      confirmLabel="Custom Label"
      hasFooter={false}
      width="50vw"
    >
      <Table.Body>
        <Table.Head>
          <Table.TextCell flexBasis={200}>
            Address
          </Table.TextCell>
          <Table.TextCell>Cost per km</Table.TextCell>
          <Table.TextCell>Total Cost</Table.TextCell>
          <Table.TextCell>Action</Table.TextCell>
        </Table.Head>
        <Table.Body>
          {drivers.map((d) => (
            <Table.Row>
              <Table.TextCell flexBasis={200}>
                {d.address}
              </Table.TextCell>
              <Table.TextCell>{d.costPerKm}</Table.TextCell>
              <Table.TextCell>{d.costPerKm * distance * seatsRequired}</Table.TextCell>
              <Table.TextCell><Button onClick={() => onDriverClicked(d)} appearance="primary" intent="success">Accept</Button></Table.TextCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Body>
    </Dialog>
  );
};

import { Pane, Dialog, Button, Table } from "evergreen-ui";
import React from "react";
import { Driver } from "../../web3/provider/state";

interface RiderModalProps {
  drivers: Driver[];
  onDriverClicked: (driver: Driver) => void;
  distance?: number;
  show?: boolean;
  onClose: () => void;
  seatsRequired: number;
}

export const RidersModal: React.FC<RiderModalProps> = ({
  drivers,
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
          <Table.TextCell>
            From
          </Table.TextCell>
          <Table.TextCell>
            To
          </Table.TextCell>
          <Table.TextCell>Total seats</Table.TextCell>
          <Table.TextCell>Cost per km</Table.TextCell>
          <Table.TextCell>Total Cost</Table.TextCell>
          <Table.TextCell>Action</Table.TextCell>
        </Table.Head>
        <Table.Body>
          {drivers.map((d) => (
            <Table.Row key={d.archiveId}>
              <Table.TextCell>
                {d.fromAddress.address}
              </Table.TextCell>
              <Table.TextCell>
                {d.toAddress.address}
              </Table.TextCell>
              <Table.TextCell>{d.selectedSeats}</Table.TextCell>
              <Table.TextCell>{d.costPerKm}</Table.TextCell>
              <Table.TextCell>{Math.ceil(d.costPerKm * distance * seatsRequired)}</Table.TextCell>
              <Table.TextCell><Button onClick={() => onDriverClicked(d)} appearance="primary" intent="success">Accept</Button></Table.TextCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Body>
    </Dialog>
  );
};

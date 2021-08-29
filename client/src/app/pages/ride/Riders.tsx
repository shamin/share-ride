
import { Pane, Dialog, Button } from "evergreen-ui";
import React from "react";


const RidersModal = () => {
  const [isShown, setIsShown] = React.useState(false);

  return (
    <Pane>
      <Dialog
        isShown={isShown}
        title="Dialog title"
        onCloseComplete={() => setIsShown(false)}
        confirmLabel="Custom Label"
      >
        Dialog content
      </Dialog>

      <Button onClick={() => setIsShown(true)}>Show Dialog</Button>
    </Pane>
  );
};

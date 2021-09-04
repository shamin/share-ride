import React from "react";
import { Pane, Dialog, Button, Spinner } from "evergreen-ui";

interface LoadingModalProps {
  isShown: boolean;
  loadingText?: string;
}

const LoadingModal: React.FC<LoadingModalProps> = ({
  isShown,
  loadingText = "Loading",
}: LoadingModalProps) => {
  return (
    <Dialog
      isShown={isShown}
      title="Loading"
      hasHeader={false}
      confirmLabel="Custom Label"
      hasClose={false}
      hasFooter={false}
      shouldCloseOnOverlayClick={false}
      shouldCloseOnEscapePress={false}
    >
      <div className="loading-modal">
        <Spinner />
        <h4>{loadingText}</h4>
      </div>
    </Dialog>
  );
};

export default LoadingModal;

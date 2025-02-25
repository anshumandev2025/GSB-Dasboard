import React from "react";
import { Modal, ModalBody, ModalContent } from "@heroui/modal";

const ViewMediaModal = ({ isOpen, onClose, url, type }) => {
  return (
    <Modal isOpen={isOpen} size="sm" onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            {type == "image" ? (
              <img
                className="w-full h-full object-cover"
                src={`${url}?t=${Date.now()}`}
              />
            ) : (
              <>
                <video
                  src={url}
                  controls
                  className="w-[50vw] h-[50vh] object-cover"
                ></video>
              </>
            )}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ViewMediaModal;

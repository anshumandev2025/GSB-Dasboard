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
                  src={video.video_url}
                  controls
                  className="w-full h-full object-cover"
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

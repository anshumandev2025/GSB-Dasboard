import React from "react";
import { Modal, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { Button } from "@heroui/button";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title }) => {
  return (
    <Modal isOpen={isOpen} size="sm" onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>{title}</ModalHeader>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button color="primary" onPress={onConfirm}>
                Confirm
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmModal;

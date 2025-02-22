import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import UsersUpdateTable from "../table/UsersUpdateTable";
import UsersStoryModal from "../table/UserStoryTable";

const UsersTableModal = ({ isOpen, onClose, user, update }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="flex items-center justify-center"
    >
      <ModalContent className="max-w-4xl w-full h-[80vh] flex flex-col">
        {(onClose) => (
          <>
            <ModalHeader>{update ? "User Update" : "User Story"}</ModalHeader>
            <ModalBody className="flex-1 w-full overflow-auto">
              {update ? (
                <UsersUpdateTable user={user} />
              ) : (
                <UsersStoryModal user={user} />
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default UsersTableModal;

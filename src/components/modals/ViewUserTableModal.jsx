import React, { useCallback, useEffect, useState } from "react";
import { Modal, ModalBody, ModalContent, useDisclosure } from "@heroui/modal";
import DataTable from "../table/DataTable";
import { api } from "../../utils/apiClient";
import { Button } from "@heroui/button";
import ViewMediaModal from "./ViewMediaModal";
import useToast from "../../hooks/useToast";

const Storycolumns = [
  { name: "Title", uid: "title" },
  { name: "Description", uid: "description" },
  { name: "Before Image", uid: "before_image" },
  { name: "After Image", uid: "after_image" },
];

const Updatecolumns = [
  { name: "Title", uid: "title" },
  { name: "Description", uid: "description" },
  { name: "Image", uid: "image" },
];

const ViewUserTableModal = ({ isOpen, onClose, user, type }) => {
  const [usersData, setUsersData] = useState([]);
  const [total, seTotal] = useState(10);
  const [page, setPage] = useState(1);
  const [image, setImage] = useState();
  const { warningToast } = useToast();
  const {
    isOpen: isOpenMediaModal,
    onClose: onCloseMediaModal,
    onOpen: onOpenMediaModal,
  } = useDisclosure();
  useEffect(() => {
    const fetchUsersData = async () => {
      const url = type == "update" ? "user/update" : "user/story";
      const response = await api.get(
        `${url}/${user?._id}?page=${page}&limit=10`
      );
      if (response.data.data && response.data.data.length == 0) {
        warningToast(
          `No user ${type == "update" ? "update" : "story"} present`
        );
      }
      setUsersData(response.data.data);
      seTotal(response.data.total);
    };
    if (type && type != "") fetchUsersData();
  }, [user, user?._idtype, page]);

  const renderCellUpdate = useCallback((userUpdate, columnKey) => {
    const cellValue = userUpdate[columnKey];
    switch (columnKey) {
      case "image":
        return (
          <Button
            onPress={() => {
              setImage(userUpdate.image);
              onOpenMediaModal();
            }}
          >
            View Image
          </Button>
        );
      case "title":
        return <div className="w-20 overflow-y-auto">{userUpdate.title}</div>;
      case "description":
        return (
          <div className="h-20 overflow-y-auto">{userUpdate.description}</div>
        );
      default:
        return cellValue;
    }
  }, []);

  const renderCellStory = useCallback((userUpdate, columnKey) => {
    const cellValue = userUpdate[columnKey];
    switch (columnKey) {
      case "title":
        return (
          <div className="w-20 h-20 overflow-y-auto">{userUpdate.title}</div>
        );
      case "description":
        return (
          <div className="h-20 overflow-y-auto">{userUpdate.description}</div>
        );
      case "before_image":
        return (
          <Button
            onPress={() => {
              setImage(userUpdate.before_image);
              onOpenMediaModal();
            }}
          >
            Before Image
          </Button>
        );
      case "after_image":
        return (
          <Button
            onPress={() => {
              setImage(userUpdate.after_image);
              onOpenMediaModal();
            }}
          >
            After Image
          </Button>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <>
      {usersData && usersData.length > 0 && (
        <Modal
          isOpen={isOpen}
          size="full"
          className="fixed inset-0 flex items-center justify-center"
          onClose={onClose}
        >
          <ModalContent className="w-full h-full max-w-7xl mx-4 my-4">
            {(onClose) => (
              <ModalBody className="h-full w-full p-6 flex flex-col">
                <div className="flex-1 w-full min-h-0">
                  {usersData && usersData.length > 0 && (
                    <DataTable
                      data={usersData}
                      total={total}
                      setPage={setPage}
                      columns={type == "story" ? Storycolumns : Updatecolumns}
                      renderCell={
                        type == "story" ? renderCellStory : renderCellUpdate
                      }
                    />
                  )}
                </div>
              </ModalBody>
            )}
          </ModalContent>
          <ViewMediaModal
            isOpen={isOpenMediaModal}
            onClose={onCloseMediaModal}
            url={image}
            type="image"
          />
        </Modal>
      )}
    </>
  );
};

export default ViewUserTableModal;

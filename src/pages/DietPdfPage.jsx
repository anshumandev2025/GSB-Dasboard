import React, { useCallback, useEffect, useState } from "react";
import Header from "../components/common/Header";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import { api } from "../utils/apiClient";
import CreateUpdateDietModal from "../components/modals/CreateUpdateDietModal";
import DataTable from "../components/table/DataTable";
import { FileText, Pencil, Trash2 } from "lucide-react";
import { Tooltip } from "@heroui/tooltip";
import ConfirmModal from "../components/modals/ConfirmModal";
const columns = [
  { name: "Title", uid: "title" },
  { name: "Description", uid: "description" },
  { name: "Type", uid: "type" },
  { name: "Category", uid: "category" },
  { name: "Pdf", uid: "pdf_url" },
  { name: "Action", uid: "action" },
];
const DietPdfPage = () => {
  const [currentDiet, setCurrentDiet] = useState();
  const {
    isOpen: isOpenDeleteDiet,
    onClose: onCloseDeleteDiet,
    onOpen: onOpenDeleteDiet,
  } = useDisclosure();
  const {
    isOpen: isOpenEditDiet,
    onClose: onCloseEditDiet,
    onOpen: onOpenEditDiet,
  } = useDisclosure();

  const deleteDiet = async () => {
    if (currentDiet) {
      try {
        await api.delete(`/diet/${currentDiet._id}`);
        onCloseDeleteDiet();
        setToggleDiets((prev) => !prev);
        successToast("Diet pdf deleted successfully");
      } catch (error) {
        console.log("error-->", error);
      }
    }
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [diets, setDiets] = useState([]);
  const [total, setTotal] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [dietToggle, setToggleDiets] = useState(false);
  useEffect(() => {
    const fetchDiets = async () => {
      const response = await api.get(
        `/diet?page=${page}&limit=10&search=${search}`
      );
      setDiets(response.data.data);
      setTotal(response.data.total);
    };
    fetchDiets();
  }, []);
  const renderCell = useCallback((diet, columnKey) => {
    const cellValue = diet[columnKey];
    switch (columnKey) {
      case "description":
        return <p className="text-wrap">{diet.description}</p>;
      case "pdf_url":
        return (
          <div>
            <a href={diet.pdf_url} target="__blank">
              <FileText />
            </a>
          </div>
        );
      case "action":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Edit user">
              <span
                onClick={() => {
                  setCurrentDiet(diet);
                  onOpenEditDiet();
                }}
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
              >
                <Pencil />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <span
                onClick={() => {
                  onOpenDeleteDiet();
                  setCurrentDiet(diet);
                }}
                className="text-lg text-danger cursor-pointer active:opacity-50"
              >
                <Trash2 />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);
  return (
    <>
      <div className="flex-1 overflow-auto relative z-10">
        <Header title="Products" />
        <div className="p-10">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex items-center gap-10">
              <Input
                className="max-w-[300px] text-black"
                variant="flat"
                placeholder="Search here..."
                type="text"
              />
            </div>
            <div className="flex flex-1 justify-end">
              <Button onPress={onOpen} color="primary">
                Add Diet pdf
              </Button>
            </div>
          </div>
          <DataTable
            data={diets}
            total={total}
            setToggleData={setToggleDiets}
            setPage={setPage}
            columns={columns}
            renderCell={renderCell}
          />
        </div>
      </div>
      <CreateUpdateDietModal
        isOpen={isOpen}
        onClose={onClose}
        setToggleDiets={setToggleDiets}
      />
      <ConfirmModal
        isOpen={isOpenDeleteDiet}
        onClose={onCloseDeleteDiet}
        title="Are you sure you want to delete this Diet pdf"
        onConfirm={deleteDiet}
      />
      <CreateUpdateDietModal
        isOpen={isOpenEditDiet}
        onClose={onCloseEditDiet}
        setToggleDiets={setToggleDiets}
        videoInfo={currentDiet}
      />
    </>
  );
};

export default DietPdfPage;

import { Chip, Pagination, Tooltip, useDisclosure } from "@heroui/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import React, { useCallback, useState } from "react";
import { FileText, Pencil, Trash2 } from "lucide-react";
import ConfirmModal from "../modals/ConfirmModal";
import { api } from "../../utils/apiClient";
import useToast from "../../hooks/useToast";
import CreateUpdateVideoModal from "../modals/CreateUpdateVideoModal";

export const columns = [
  { name: "Title", uid: "title" },
  { name: "Description", uid: "description" },
  { name: "Type", uid: "type" },
  { name: "Category", uid: "category" },
  { name: "Pdf", uid: "pdf_url" },
  { name: "Action", uid: "action" },
];

const DietPdfTable = ({ diets, setToggleDiets, total, setPage }) => {
  const { successToast, errorToast } = useToast();
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
    <div className="mt-10 space-y-10 text-black">
      <Table
        aria-label="Example table with custom cells "
        className="h-screen"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              initialPage={1}
              total={parseInt(total / 10) + 1}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={diets}>
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ConfirmModal
        isOpen={isOpenDeleteDiet}
        onClose={onCloseDeleteDiet}
        title="Are you sure you want to delete this Diet pdf"
        onConfirm={deleteDiet}
      />
      <CreateUpdateVideoModal
        isOpen={isOpenEditDiet}
        onClose={onCloseEditDiet}
        setToggleDiets={setToggleDiets}
        videoInfo={currentDiet}
      />
    </div>
  );
};

export default DietPdfTable;

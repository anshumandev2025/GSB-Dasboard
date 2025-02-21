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
import { Pencil } from "lucide-react";
import { Trash2 } from "lucide-react";
import CreateEmployeeModal from "../modals/CreateEmployeeModal";
import ConfirmModal from "../modals/ConfirmModal";
import useToast from "../../hooks/useToast";
import axios from "axios";
import { baseURL } from "../../utils/urls";

export const columns = [
  { name: "NAME", uid: "employee_name" },
  { name: "Email", uid: "employee_email_address" },
  { name: "Mobile", uid: "employee_mobile_number" },
  { name: "Status", uid: "is_employee_active" },
  { name: "Actions", uid: "actions" },
];

const EmployeeTable = ({ employeesData, total, setToggleFetchEmployees }) => {
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { successToast, errorToast } = useToast();
  const {
    isOpen: isOpenConfirmModal,
    onClose: onCloseConfirmModal,
    onOpen: onOpenConfirmModal,
  } = useDisclosure();
  const {
    isOpen: isOpenStatusUpdate,
    onClose: onCloseStatusUpdate,
    onOpen: onOpenStatusUpdate,
  } = useDisclosure();
  const deleteSelectedEmployee = async () => {
    try {
      await axios.delete(`${baseURL}/employee/${employeeInfo._id}`);
      successToast("Employee deleted successfully");
      setToggleFetchEmployees((prev) => !prev);
      onCloseConfirmModal();
    } catch (error) {
      console.log("error-->", error);
      errorToast(error.response.data.message);
    }
  };
  const updateEmployeeStatus = async () => {
    try {
      await axios.patch(
        `${baseURL}/employee/${employeeInfo._id}?status=${
          employeeInfo.is_employee_active ? false : true
        }`
      );
      successToast(
        `Employee ${
          employeeInfo.is_employee_active ? "Deactivated" : "Activated"
        } successfully`
      );
      setToggleFetchEmployees((prev) => !prev);
      onCloseStatusUpdate();
    } catch (error) {
      console.log("error-->", error);
      errorToast(error.response.data.message);
    }
  };
  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "is_employee_active":
        return (
          <Chip
            className="capitalize cursor-pointer"
            color={user.is_employee_active ? "success" : "danger"}
            size="sm"
            variant="flat"
            onClick={() => {
              setEmployeeInfo(user);
              onOpenStatusUpdate();
            }}
          >
            {user.is_employee_active ? "Active" : "Deactive"}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Edit user">
              <span
                onClick={() => {
                  setEmployeeInfo(user);
                  onOpen();
                }}
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
              >
                <Pencil />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <span
                onClick={() => {
                  setEmployeeInfo(user);
                  onOpenConfirmModal();
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
      <Table aria-label="Example table with custom cells">
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
        <TableBody items={employeesData}>
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="w-full flex justify-end">
        <Pagination isCompact showControls initialPage={1} total={total} />
      </div>
      <CreateEmployeeModal
        isOpen={isOpen}
        onClose={onClose}
        employeeInfo={employeeInfo}
        setToggleFetchEmployees={setToggleFetchEmployees}
      />
      <ConfirmModal
        isOpen={isOpenConfirmModal}
        onClose={onCloseConfirmModal}
        title="Are you sure you want to delete this employee?"
        onConfirm={deleteSelectedEmployee}
      />
      <ConfirmModal
        isOpen={isOpenStatusUpdate}
        onClose={onCloseStatusUpdate}
        title={`Are you sure you want to ${
          employeeInfo?.is_employee_active ? "Deactive" : "Active"
        } this employee?`}
        onConfirm={updateEmployeeStatus}
      />
    </div>
  );
};

export default EmployeeTable;

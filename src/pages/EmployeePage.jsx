import React, { useCallback, useEffect, useState } from "react";
import Header from "../components/common/Header";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import CreateEmployeeModal from "../components/modals/CreateEmployeeModal";
import { useDisclosure } from "@heroui/modal";
import DataTable from "../components/table/DataTable";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import { Pencil, Trash2 } from "lucide-react";
import ConfirmModal from "../components/modals/ConfirmModal";
import { api } from "../utils/apiClient";
import useToast from "../hooks/useToast";
const columns = [
  { name: "NAME", uid: "employee_name" },
  { name: "Email", uid: "employee_email_address" },
  { name: "Mobile", uid: "employee_mobile_number" },
  { name: "Status", uid: "is_employee_active" },
  { name: "Actions", uid: "actions" },
];
const EmployeePage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
  const {
    isOpen: isOpenEdit,
    onClose: onCloseEdit,
    onOpen: onOpenEdit,
  } = useDisclosure();
  const [employeesData, setEmployeesData] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [toggleFetchEmployees, setToggleFetchEmployees] = useState(false);
  const [page, setPage] = useState(1);
  const [employeeInfo, setEmployeeInfo] = useState();
  const { errorToast, successToast } = useToast();
  console.log("toggle fetch employees", toggleFetchEmployees);
  useEffect(() => {
    const fetchEmployeesData = async () => {
      try {
        const response = await api.get(
          `/employee?page=${page}&limit=10&query=${query}&filter=${filter}`
        );
        setEmployeesData(response.data.data);
        setTotalEmployees(response.data.total);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchEmployeesData();
  }, [page, query, filter, toggleFetchEmployees]);
  const deleteSelectedEmployee = async () => {
    try {
      await api.delete(`/employee/${employeeInfo._id}`);
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
      await api.patch(
        `/employee/${employeeInfo._id}?status=${
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
                  onOpenEdit();
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
    <>
      <div className="flex-1 overflow-auto relative z-10">
        <Header title="Employees" />
        <div className="p-10">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex items-center gap-10">
              <Input
                className="max-w-[300px] text-black"
                variant="flat"
                placeholder="Search Employees"
                type="text"
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-1 justify-end">
              <Button
                onPress={() => {
                  onOpen();
                }}
                color="primary"
              >
                Add Employee
              </Button>
            </div>
          </div>
          <DataTable
            data={employeesData}
            total={totalEmployees}
            setPage={setPage}
            columns={columns}
            renderCell={renderCell}
          />
        </div>
      </div>
      <CreateEmployeeModal
        isOpen={isOpen}
        onClose={onClose}
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
      <CreateEmployeeModal
        isOpen={isOpenEdit}
        onClose={onCloseEdit}
        employeeInfo={employeeInfo}
        setToggleFetchEmployees={setToggleFetchEmployees}
      />
    </>
  );
};

export default EmployeePage;

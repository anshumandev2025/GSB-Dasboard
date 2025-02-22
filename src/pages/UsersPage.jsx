import React, { useCallback, useEffect, useState } from "react";
import Header from "../components/common/Header";
import { Input } from "@heroui/input";
import { api } from "../utils/apiClient";
import DataTable from "../components/table/DataTable";
import { Chip } from "@heroui/chip";
import { CalendarCheck, Newspaper } from "lucide-react";
import { useDisclosure } from "@heroui/modal";
import { Tooltip } from "@heroui/tooltip";
import ViewUserTableModal from "../components/modals/ViewUserTableModal";
const columns = [
  { name: "Name", uid: "user_name" },
  { name: "Email address", uid: "user_email_address" },
  { name: "Mobile number", uid: "user_mobile_number" },
  { name: "Goal", uid: "user_goal" },
  { name: "Subscribed", uid: "user_isSubscribed" },
  { name: "Actions", uid: "action" },
];
const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [toggleUsers, setToggleUsers] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(10);
  const [currentUser, setCurrentUser] = useState();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [userAction, setUserAction] = useState("");
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await api.get(
        `/user?page${page}&limit=10&search=${search}`
      );
      console.log("response-->", response);
      setUsers(response.data.data);
      setTotal(response.data.total);
    };
    fetchUsers();
  }, [search, toggleUsers]);

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];
    switch (columnKey) {
      case "user_goal":
        return (
          <Chip className="capitalize" size="sm" variant="flat">
            {cellValue}
          </Chip>
        );
      case "user_isSubscribed":
        return (
          <Chip
            color={cellValue == "True" ? "success" : "danger"}
            className="capitalize"
            size="sm"
            variant="flat"
          >
            {cellValue}
          </Chip>
        );
      case "action":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="User Updates">
              <span
                onClick={() => {
                  setUserAction("update");
                  setCurrentUser(user);
                  onOpen();
                }}
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
              >
                <CalendarCheck color="#10B981" />
              </span>
            </Tooltip>
            <Tooltip content="User story">
              <span
                onClick={() => {
                  setUserAction("story");
                  setCurrentUser(user);
                  onOpen();
                }}
                className="text-lg text-danger cursor-pointer active:opacity-50"
              >
                <Newspaper color="#3B82F6" />
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
        <Header title="Users" />
        <div className="p-10">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex items-center gap-10">
              <Input
                className="max-w-[300px] text-black"
                variant="flat"
                placeholder="Search users"
                type="text"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <DataTable
            data={users}
            setToggleData={setToggleUsers}
            total={total}
            setPage={setPage}
            columns={columns}
            renderCell={renderCell}
          />
        </div>
      </div>
      <ViewUserTableModal
        isOpen={isOpen}
        onClose={onClose}
        type={userAction}
        user={currentUser}
      />
    </>
  );
};

export default UsersPage;

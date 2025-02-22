import { Chip, Pagination, Tooltip, useDisclosure } from "@heroui/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { CalendarCheck, Newspaper } from "lucide-react";
import React, { useCallback, useState } from "react";
import UsersTableModal from "../modals/UserTableModal";

export const columns = [
  { name: "Name", uid: "user_name" },
  { name: "Email address", uid: "user_email_address" },
  { name: "Mobile number", uid: "user_mobile_number" },
  { name: "Goal", uid: "user_goal" },
  { name: "Subscribed", uid: "user_isSubscribed" },
  { name: "Actions", uid: "action" },
];

const UsersTable = ({ users, total, setPage }) => {
  const [currentUser, setCurrentUser] = useState();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isUpdate, setIsUpdate] = useState(false);
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
                  setIsUpdate(true);
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
                  setIsUpdate(false);
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
        <TableBody items={users}>
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <UsersTableModal
        isOpen={isOpen}
        onClose={onClose}
        user={currentUser}
        update={isUpdate}
      />
    </div>
  );
};

export default UsersTable;

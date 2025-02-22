import { Chip, Pagination, Tooltip } from "@heroui/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import React, { useCallback, useEffect, useState } from "react";
import { api } from "../../utils/apiClient";

export const columns = [
  { name: "Title", uid: "title" },
  { name: "Description", uid: "description" },
  { name: "Image", uid: "image" },
];

const UsersUpdateTable = ({ user }) => {
  const [usersUpdates, setUsersUpdates] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(10);
  useEffect(() => {
    const fetchUserUpdates = async () => {
      const response = await api.get(
        `/user/update/${user._id}?page=${page}&limit=10`
      );
      setUsersUpdates(response.data.data);
      setTotal(response.data.total);
    };
    if (user) fetchUserUpdates();
  }, [user, user._id, page]);
  const renderCell = useCallback((userUpdate, columnKey) => {
    const cellValue = userUpdate[columnKey];
    switch (columnKey) {
      case "image":
        return (
          <img
            className="size-20 object-cover"
            src={userUpdate?.image}
            alt="user update"
          />
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
  return (
    <div className="mt-10 space-y-10 w-full text-black">
      <Table
        aria-label="Example table with w-full custom cells "
        className="h-screen "
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
        <TableBody items={usersUpdates}>
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersUpdateTable;

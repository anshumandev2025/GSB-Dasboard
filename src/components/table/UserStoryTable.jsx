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
  { name: "Before Image", uid: "before_image" },
  { name: "After Image", uid: "after_image" },
];

const UsersStoryModal = ({ user }) => {
  const [usersStory, setUsersStory] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(10);
  useEffect(() => {
    const fetchUserStory = async () => {
      const response = await api.get(
        `/user/story/${user._id}?page=${page}&limit=10`
      );
      setUsersStory(response.data.data);
      setTotal(response.data.total);
    };
    if (user) fetchUserStory();
  }, [user, user._id, page]);
  const renderCell = useCallback((userUpdate, columnKey) => {
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
          <img
            className="size-20 object-cover"
            src={userUpdate?.before_image}
            alt="user update"
          />
        );
      case "after_image":
        return (
          <img
            className="size-20 object-cover"
            src={userUpdate?.after_image}
            alt="user update"
          />
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
        <TableBody items={usersStory}>
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

export default UsersStoryModal;

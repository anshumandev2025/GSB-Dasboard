import { Chip, Pagination, Tooltip } from "@heroui/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import React, { useCallback } from "react";

export const columns = [
  { name: "Name", uid: "name" },
  { name: "Email", uid: "email" },
  { name: "Mobile", uid: "mobile" },
  { name: "Goal", uid: "goal" },
];
export const users = [
  {
    id: 1,
    name: "Tony Reichert",
    mobile: "235235343",
    goal: "IBS",
    email: "tony.reichert@example.com",
  },
  {
    id: 2,
    name: "Zoey Lang",
    mobile: "83749834",
    goal: "depression",
    email: "zoey.lang@example.com",
  },
  {
    id: 3,
    name: "Jane Fisher",
    mobile: "734398473",
    goal: "IBS",
    email: "jane.fisher@example.com",
  },
  {
    id: 4,
    name: "William Howard",
    mobile: "83242343",
    goal: "IBS",
    email: "william.howard@example.com",
  },
  {
    id: 5,
    name: "Kristen Copper",
    mobile: "989809099",
    goal: "IBS",
    email: "kristen.cooper@example.com",
  },

  {
    id: 6,
    name: "Tony Reichert",
    mobile: "235235343",
    goal: "IBS",
    email: "tony.reichert@example.com",
  },
  {
    id: 7,
    name: "Zoey Lang",
    mobile: "83749834",
    goal: "IBS",
    email: "zoey.lang@example.com",
  },
  {
    id: 8,
    name: "Jane Fisher",
    mobile: "734398473",
    goal: "IBS",
    email: "jane.fisher@example.com",
  },
  {
    id: 9,
    name: "William Howard",
    mobile: "83242343",
    goal: "IBS",
    email: "william.howard@example.com",
  },
  {
    id: 10,
    name: "Kristen Copper",
    mobile: "989809099",
    goal: "IBS",
    email: "kristen.cooper@example.com",
  },
];

const UsersTable = () => {
  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return <h1>{user.name}</h1>;
      case "goal":
        return (
          <Chip className="capitalize" size="sm" variant="flat">
            {cellValue}
          </Chip>
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
        <TableBody items={users}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="w-full flex justify-end">
        <Pagination isCompact showControls initialPage={1} total={10} />
      </div>
    </div>
  );
};

export default UsersTable;

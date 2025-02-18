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
  { name: "Price", uid: "price" },
  { name: "Description", uid: "description" },
  { name: "Image", uid: "image" },
];
export const users = [
  {
    id: 1,
    name: "Tony Reichert",
    price: "400",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti amet quia, asperiores officia consectetur blanditiis saepe praesentium atque. Ipsum, consequatur?",
    image:
      "https://www.patanjaliayurved.net/assets/product_images/400x400/1737527431thumbnail.webp",
  },
  {
    id: 2,
    name: "Tony Reichert",
    price: "400",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti amet quia, asperiores officia consectetur blanditiis saepe praesentium atque. Ipsum, consequatur?",
    image:
      "https://www.patanjaliayurved.net/assets/product_images/400x400/1737527431thumbnail.webp",
  },
  {
    id: 3,
    name: "Tony Reichert",
    price: "400",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti amet quia, asperiores officia consectetur blanditiis saepe praesentium atque. Ipsum, consequatur?",
    image:
      "https://www.patanjaliayurved.net/assets/product_images/400x400/1737527431thumbnail.webp",
  },
  {
    id: 4,
    name: "Tony Reichert",
    price: "400",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti amet quia, asperiores officia consectetur blanditiis saepe praesentium atque. Ipsum, consequatur?",
    image:
      "https://www.patanjaliayurved.net/assets/product_images/400x400/1737527431thumbnail.webp",
  },
  {
    id: 5,
    name: "Tony Reichert",
    price: "400",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti amet quia, asperiores officia consectetur blanditiis saepe praesentium atque. Ipsum, consequatur?",
    image:
      "https://www.patanjaliayurved.net/assets/product_images/400x400/1737527431thumbnail.webp",
  },

  {
    id: 6,
    name: "Tony Reichert",
    price: "400",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti amet quia, asperiores officia consectetur blanditiis saepe praesentium atque. Ipsum, consequatur?",
    image:
      "https://www.patanjaliayurved.net/assets/product_images/400x400/1737527431thumbnail.webp",
  },
  {
    id: 7,
    name: "Tony Reichert",
    price: "400",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti amet quia, asperiores officia consectetur blanditiis saepe praesentium atque. Ipsum, consequatur?",
    image:
      "https://www.patanjaliayurved.net/assets/product_images/400x400/1737527431thumbnail.webp",
  },
  {
    id: 8,
    name: "Tony Reichert",
    price: "400",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti amet quia, asperiores officia consectetur blanditiis saepe praesentium atque. Ipsum, consequatur?",
    image:
      "https://www.patanjaliayurved.net/assets/product_images/400x400/1737527431thumbnail.webp",
  },
  {
    id: 9,
    name: "Tony Reichert",
    price: "400",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti amet quia, asperiores officia consectetur blanditiis saepe praesentium atque. Ipsum, consequatur?",
    image:
      "https://www.patanjaliayurved.net/assets/product_images/400x400/1737527431thumbnail.webp",
  },
  {
    id: 10,
    name: "Tony Reichert",
    price: "400",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti amet quia, asperiores officia consectetur blanditiis saepe praesentium atque. Ipsum, consequatur?",
    image:
      "https://www.patanjaliayurved.net/assets/product_images/400x400/1737527431thumbnail.webp",
  },
];

const ProductsTable = () => {
  const renderCell = useCallback((product, columnKey) => {
    const cellValue = product[columnKey];
    switch (columnKey) {
      case "description":
        return <p className="text-wrap">{product.description}</p>;
      case "image":
        return <img src={product.image} alt="product" />;
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
      <Table aria-label="Example table with custom cells " className="h-screen">
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

export default ProductsTable;

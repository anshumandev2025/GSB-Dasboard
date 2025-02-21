import { Chip, Pagination, Tooltip, useDisclosure } from "@heroui/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { baseURL } from "../../utils/urls";
import { Pencil, Trash2 } from "lucide-react";
import ConfirmModal from "../modals/ConfirmModal";

export const columns = [
  { name: "Name", uid: "name" },
  { name: "Category", uid: "category" },
  { name: "Price", uid: "price" },
  { name: "Description", uid: "description" },
  { name: "Image", uid: "image" },
  { name: "Action", uid: "action" },
];

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState();
  const {
    isOpen: isOpenDeleteProduct,
    onClose: onCloseDeleteProduct,
    onOpen: onOpenDeleteProduct,
  } = useDisclosure();
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get(`${baseURL}/product`);
      setProducts(response.data);
    };
    fetchProducts();
  }, []);

  const deleteProduct = async () => {
    if (currentProduct) {
      try {
        await axios.delete(`${baseURL}/product/${currentProduct._id}`);
        onCloseDeleteProduct();
      } catch (error) {
        console.log("error-->", error);
      }
    }
  };
  const renderCell = useCallback((product, columnKey) => {
    const cellValue = product[columnKey];
    switch (columnKey) {
      case "description":
        return <p className="text-wrap">{product.description}</p>;
      case "image":
        return (
          <img
            className="size-20 object-cover"
            src={product.image}
            alt="product"
          />
        );
      case "goal":
        return (
          <Chip className="capitalize" size="sm" variant="flat">
            {cellValue}
          </Chip>
        );
      case "action":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Edit user">
              <span
                onClick={() => {
                  setCurrentProduct(product);
                }}
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
              >
                <Pencil />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <span
                onClick={() => {
                  onOpenDeleteProduct();
                  setCurrentProduct(product);
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
        <TableBody items={products}>
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
        <Pagination isCompact showControls initialPage={1} total={10} />
      </div>
      <ConfirmModal
        isOpen={isOpenDeleteProduct}
        onClose={onCloseDeleteProduct}
        title="Are you sure you want to delete this product"
        onConfirm={deleteProduct}
      />
    </div>
  );
};

export default ProductsTable;

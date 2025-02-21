import {
  Chip,
  Pagination,
  Tooltip,
  useDisclosure,
  usePagination,
} from "@heroui/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import React, { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import ConfirmModal from "../modals/ConfirmModal";
import { api } from "../../utils/apiClient";
import useToast from "../../hooks/useToast";
import CreateUpdateProductModal from "../modals/CreateUpdateProductModal";

export const columns = [
  { name: "Name", uid: "name" },
  // { name: "Category", uid: "category" },
  { name: "Price", uid: "price" },
  { name: "Description", uid: "description" },
  { name: "Image", uid: "image" },
  { name: "Action", uid: "action" },
];

const ProductsTable = ({
  products,
  setToggleFetchProducts,
  total,
  setPage,
}) => {
  const { successToast, errorToast } = useToast();
  const [currentProduct, setCurrentProduct] = useState();
  const {
    isOpen: isOpenDeleteProduct,
    onClose: onCloseDeleteProduct,
    onOpen: onOpenDeleteProduct,
  } = useDisclosure();
  const {
    isOpen: isOpenEditProduct,
    onClose: onCloseEditProduct,
    onOpen: onOpenEditProduct,
  } = useDisclosure();

  const deleteProduct = async () => {
    if (currentProduct) {
      try {
        await api.delete(`/product/${currentProduct._id}`);
        onCloseDeleteProduct();
        setToggleFetchProducts((prev) => !prev);
        successToast("Product deleted successfully");
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
            src={`${product.image}?t=${Date.now()}`}
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
                  onOpenEditProduct();
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
              total={total / 10 + 1}
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
      <ConfirmModal
        isOpen={isOpenDeleteProduct}
        onClose={onCloseDeleteProduct}
        title="Are you sure you want to delete this product"
        onConfirm={deleteProduct}
      />
      <CreateUpdateProductModal
        isOpen={isOpenEditProduct}
        onClose={onCloseEditProduct}
        setToggleFetchProducts={setToggleFetchProducts}
        productInfo={currentProduct}
      />
    </div>
  );
};

export default ProductsTable;

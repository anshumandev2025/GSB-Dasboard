import React, { useCallback, useEffect, useState } from "react";
import Header from "../components/common/Header";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import CreateUpdateProductModal from "../components/modals/CreateUpdateProductModal";
import { api } from "../utils/apiClient";
import DataTable from "../components/table/DataTable";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import { Pencil, Trash2 } from "lucide-react";
import ConfirmModal from "../components/modals/ConfirmModal";
import ViewMediaModal from "../components/modals/ViewMediaModal";

const ProductsPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
  const {
    isOpen: isOpenMediaModal,
    onClose: onCloseMediaModal,
    onOpen: onOpenMediaModal,
  } = useDisclosure();

  const [products, setProducts] = useState([]);
  const [toggleFetchProducts, setToggleFetchProducts] = useState(false);
  const [search, setSearch] = useState("");
  const [totalProducts, setTotalProducts] = useState(10);
  const [currentProduct, setCurrentProduct] = useState();
  const [page, setPage] = useState(1);
  const columns = [
    { name: "Name", uid: "name" },
    { name: "Price", uid: "price" },
    { name: "Description", uid: "description" },
    { name: "Image", uid: "image" },
    { name: "Action", uid: "action" },
  ];
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
          <Button
            onPress={() => {
              setCurrentProduct(product);
              onOpenMediaModal();
            }}
          >
            View Image
          </Button>
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

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await api.get(
        `/product?limit=10&page=${page}&search=${search}`
      );
      setProducts(response.data.data);
      setTotalProducts(response.data.total);
    };
    fetchProducts();
  }, [toggleFetchProducts, search, page]);
  return (
    <>
      <div className="flex-1 overflow-auto relative z-10">
        <Header title="Products" />
        <div className="p-10">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex items-center gap-10">
              <Input
                className="max-w-[300px] text-black"
                variant="flat"
                placeholder="Search Products"
                type="text"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-1 justify-end">
              <Button onPress={onOpen} color="primary">
                Add Product
              </Button>
            </div>
          </div>
          <DataTable
            data={products}
            total={totalProducts}
            setPage={setPage}
            setToggleData={setTotalProducts}
            columns={columns}
            renderCell={renderCell}
          />
        </div>
      </div>

      <CreateUpdateProductModal
        isOpen={isOpen}
        onClose={onClose}
        setToggleFetchProducts={setToggleFetchProducts}
      />

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
      <ViewMediaModal
        isOpen={isOpenMediaModal}
        onClose={onCloseMediaModal}
        url={currentProduct?.image}
        type="image"
      />
    </>
  );
};

export default ProductsPage;

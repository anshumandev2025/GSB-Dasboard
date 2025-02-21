import React from "react";
import Header from "../components/common/Header";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import ProductsTable from "../components/table/ProductsTable";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import CreateUpdateProductModal from "../components/modals/CreateUpdateProductModal";

const ProductsPage = () => {
  const filterOptions = ["IBS", "Depression"];
  const { isOpen, onOpen, onClose } = useDisclosure();

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
                placeholder="Search here..."
                type="text"
              />
            </div>
            <div className="flex flex-1 justify-end">
              <Button onPress={onOpen} color="primary">
                Add Product
              </Button>
            </div>
          </div>
          <ProductsTable />
        </div>
      </div>
      <CreateUpdateProductModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default ProductsPage;

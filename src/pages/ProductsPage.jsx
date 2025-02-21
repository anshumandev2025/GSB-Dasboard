import React, { useEffect, useState } from "react";
import Header from "../components/common/Header";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import ProductsTable from "../components/table/ProductsTable";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import CreateUpdateProductModal from "../components/modals/CreateUpdateProductModal";
import { api } from "../utils/apiClient";

const ProductsPage = () => {
  const filterOptions = ["IBS", "Depression"];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [products, setProducts] = useState([]);
  const [toggleFetchProducts, setToggleFetchProducts] = useState(false);
  const [search, setSearch] = useState("");
  const [totalProducts, setTotalProducts] = useState(10);
  const [page, setPage] = useState(1);
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
          <ProductsTable
            products={products}
            setToggleFetchProducts={setToggleFetchProducts}
            total={totalProducts}
            setPage={setPage}
          />
        </div>
      </div>
      <CreateUpdateProductModal
        isOpen={isOpen}
        onClose={onClose}
        setToggleFetchProducts={setToggleFetchProducts}
      />
    </>
  );
};

export default ProductsPage;

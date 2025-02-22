import React, { useEffect, useState } from "react";
import Header from "../components/common/Header";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import CreateEmployeeModal from "../components/modals/CreateEmployeeModal";
import DietPdfTable from "../components/table/DietPdfTable";
import { api } from "../utils/apiClient";
import CreateUpdateDietModal from "../components/modals/CreateUpdateDietModal";

const DietPdfPage = () => {
  const filterOptions = ["IBS", "Depression"];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [diets, setDiets] = useState([]);
  const [total, setTotal] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [dietToggle, setToggleDiets] = useState(false);
  useEffect(() => {
    const fetchDiets = async () => {
      const response = await api.get(
        `/diet?page=${page}&limit=10&search=${search}`
      );
      setDiets(response.data.data);
      setTotal(response.data.total);
    };
    fetchDiets();
  }, []);
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
                Add Diet pdf
              </Button>
            </div>
          </div>
          <DietPdfTable
            diets={diets}
            total={total}
            setToggleDiets={setToggleDiets}
            setPage={setPage}
          />
        </div>
      </div>
      <CreateUpdateDietModal
        isOpen={isOpen}
        onClose={onClose}
        setToggleDiets={setToggleDiets}
      />
    </>
  );
};

export default DietPdfPage;

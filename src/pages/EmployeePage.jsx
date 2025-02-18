import React, { useEffect, useState } from "react";
import Header from "../components/common/Header";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import CreateEmployeeModal from "../components/modals/CreateEmployeeModal";
import { useDisclosure } from "@heroui/modal";
import EmployeeTable from "../components/table/EmployeeTable";
import axios from "axios";
import { baseURL } from "../utils/urls";

const EmployeePage = () => {
  const filterOptions = ["Active", "Deactive"];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [employeesData, setEmployeesData] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [toggleFetchEmployees, setToggleFetchEmployees] = useState(false);

  console.log("toggle fetch employees", toggleFetchEmployees);
  useEffect(() => {
    const fetchEmployeesData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/employee?page=1&limit={10}&query=${query}&filter=${filter}`
        );
        setEmployeesData(response.data.data);
        setTotalEmployees(response.data.total);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchEmployeesData();
  }, [query, filter, toggleFetchEmployees]);
  return (
    <>
      <div className="flex-1 overflow-auto relative z-10">
        <Header title="Employees" />
        <div className="p-10">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex items-center gap-10">
              <Input
                className="max-w-[300px] text-black"
                variant="flat"
                placeholder="Search here..."
                type="text"
                onChange={(e) => setQuery(e.target.value)}
              />
              <Select
                onChange={(e) =>
                  e.target.value == "0"
                    ? setFilter("active")
                    : setFilter("deactive")
                }
                className="w-60"
                placeholder="Select Filter"
              >
                {filterOptions.map((filter, index) => (
                  <SelectItem key={index}>{filter}</SelectItem>
                ))}
              </Select>
            </div>
            <div className="flex flex-1 justify-end">
              <Button
                onPress={() => {
                  onOpen();
                }}
                color="primary"
              >
                Add Employee
              </Button>
            </div>
          </div>
          <EmployeeTable
            employeesData={employeesData}
            total={totalEmployees}
            query={query}
            setToggleFetchEmployees={setToggleFetchEmployees}
          />
        </div>
      </div>
      <CreateEmployeeModal
        isOpen={isOpen}
        onClose={onClose}
        setToggleFetchEmployees={setToggleFetchEmployees}
      />
    </>
  );
};

export default EmployeePage;

import React from "react";
import Header from "../components/common/Header";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import UsersTable from "../components/table/UsersTable";

const UsersPage = () => {
  const filterOptions = ["IBS", "Depression"];
  return (
    <>
      <div className="flex-1 overflow-auto relative z-10">
        <Header title="Users" />
        <div className="p-10">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex items-center gap-10">
              <Input
                className="max-w-[300px] text-black"
                variant="flat"
                placeholder="Search here..."
                type="text"
              />
              <Select className="w-60" placeholder="Select Filter">
                {filterOptions.map((filter, index) => (
                  <SelectItem key={index}>{filter}</SelectItem>
                ))}
              </Select>
            </div>
          </div>
          <UsersTable />
        </div>
      </div>
    </>
  );
};

export default UsersPage;

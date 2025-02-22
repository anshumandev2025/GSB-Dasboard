import React, { useEffect, useState } from "react";
import Header from "../components/common/Header";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import UsersTable from "../components/table/UsersTable";
import { api } from "../utils/apiClient";

const UsersPage = () => {
  const filterOptions = ["IBS", "Depression"];
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [toggleUsers, setToggleUsers] = useState(false);
  const [page, setPage] = useState(1);
  const [isSubscribed, setIsSubscribed] = useState(null);
  const [total, setTotal] = useState(10);
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await api.get(
        `/user?page${page}&limit=10&search=${search}&filter=${
          filterOptions[filter] == undefined ? "" : filterOptions[filter]
        }`
      );
      console.log("response-->", response);
      setUsers(response.data.data);
      setTotal(response.data.total);
    };
    fetchUsers();
  }, [search, filter, toggleUsers, isSubscribed]);
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
                placeholder="Search users"
                type="text"
                onChange={(e) => setSearch(e.target.value)}
              />
              {/* <Select
                onChange={(e) => setFilter(e.target.value)}
                className="w-60"
                placeholder="Select Filter"
              >
                {filterOptions.map((filter, index) => (
                  <SelectItem key={index}>{filter}</SelectItem>
                ))}
              </Select> */}
            </div>
          </div>
          <UsersTable
            users={users}
            setToggleUsers={setToggleUsers}
            total={total}
            setPage={setPage}
          />
        </div>
      </div>
    </>
  );
};

export default UsersPage;

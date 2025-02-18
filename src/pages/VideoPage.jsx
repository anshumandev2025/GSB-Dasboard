import React from "react";
import Header from "../components/common/Header";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import VideoTable from "../components/table/VideoTable";
import { useDisclosure } from "@heroui/modal";
import { Button } from "@heroui/button";

const VideoPage = () => {
  const filterOptions = ["Youtube", "Uploaded"];
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <div className="flex-1 overflow-auto relative z-10">
        <Header title="Videos" />
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
            <div className="flex flex-1 justify-end">
              <Button onPress={onOpen} color="primary">
                Add Video
              </Button>
            </div>
          </div>

          <VideoTable />
        </div>
      </div>
    </>
  );
};

export default VideoPage;

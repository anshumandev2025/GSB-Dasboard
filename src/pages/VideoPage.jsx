import React, { useEffect, useState } from "react";
import Header from "../components/common/Header";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import VideoTable from "../components/table/VideoTable";
import { useDisclosure } from "@heroui/modal";
import { Button } from "@heroui/button";
import CreateUpdateVideoModal from "../components/modals/CreateUpdateVideoModal";
import { api } from "../utils/apiClient";

const VideoPage = () => {
  const filterOptions = ["Youtube", "Uploaded"];
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(10);
  const [search, setSearch] = useState("");
  const {
    isOpen: isOpenAddVideo,
    onOpen: onOpenAddVideo,
    onClose: onCloseAddVideo,
  } = useDisclosure();
  const [toggleFetchVideos, setToggleFetchVideos] = useState(false);
  useEffect(() => {
    const fetchVideos = async () => {
      const response = await api.get(
        `/video?page=${page}&limit=10&search=${search}`
      );
      setVideos(response.data.data);
      setTotal(response.data.total);
    };
    fetchVideos();
  }, [toggleFetchVideos, search]);
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
                placeholder="Search Video here"
                type="text"
                onChange={(e) => setSearch(e.target.value)}
              />
              {/* <Select className="w-60" placeholder="Select Filter">
                {filterOptions.map((filter, index) => (
                  <SelectItem key={index}>{filter}</SelectItem>
                ))}
              </Select> */}
            </div>
            <div className="flex flex-1 justify-end">
              <Button onPress={onOpenAddVideo} color="primary">
                Add Video
              </Button>
            </div>
          </div>

          <VideoTable
            videos={videos}
            total={total}
            setPage={setPage}
            setToggleFetchVideos={setToggleFetchVideos}
          />
        </div>
      </div>
      <CreateUpdateVideoModal
        isOpen={isOpenAddVideo}
        onClose={onCloseAddVideo}
        setToggleFetchVideos={setToggleFetchVideos}
      />
    </>
  );
};

export default VideoPage;

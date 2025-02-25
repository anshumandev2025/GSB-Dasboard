import React, { useCallback, useEffect, useState } from "react";
import Header from "../components/common/Header";
import { Input } from "@heroui/input";
import { useDisclosure } from "@heroui/modal";
import { Button } from "@heroui/button";
import CreateUpdateVideoModal from "../components/modals/CreateUpdateVideoModal";
import { api } from "../utils/apiClient";
import DataTable from "../components/table/DataTable";
import ConfirmModal from "../components/modals/ConfirmModal";
import ViewMediaModal from "../components/modals/ViewMediaModal";
import { Tooltip } from "@heroui/tooltip";
import { Pencil, Trash2 } from "lucide-react";

const columns = [
  { name: "Title", uid: "title" },
  { name: "Description", uid: "description" },
  { name: "Type", uid: "type" },
  { name: "Category", uid: "category" },
  { name: "Video", uid: "video_url" },
  { name: "Action", uid: "action" },
];
const VideoPage = () => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(10);
  const [search, setSearch] = useState("");
  const [currentVideo, setCurrentVideo] = useState();
  const [toggleFetchVideos, setToggleFetchVideos] = useState(false);
  const {
    isOpen: isOpenAddVideo,
    onOpen: onOpenAddVideo,
    onClose: onCloseAddVideo,
  } = useDisclosure();
  const {
    isOpen: isOpenDeleteVideo,
    onClose: onCloseDeleteVideo,
    onOpen: onOpenDeleteVideo,
  } = useDisclosure();
  const {
    isOpen: isOpenEditVideo,
    onClose: onCloseEditVideo,
    onOpen: onOpenEditVideo,
  } = useDisclosure();
  const {
    isOpen: isOpenMediaModal,
    onClose: onCloseMediaModal,
    onOpen: onOpenMediaModal,
  } = useDisclosure();
  const deleteVideo = async () => {
    if (currentVideo) {
      try {
        await api.delete(`/video/${currentVideo._id}`);
        onCloseDeleteVideo();
        setToggleFetchVideos((prev) => !prev);
        successToast("Product deleted successfully");
      } catch (error) {
        console.log("error-->", error);
      }
    }
  };
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
  const renderCell = useCallback((video, columnKey) => {
    const cellValue = video[columnKey];
    switch (columnKey) {
      case "description":
        return <p className="text-wrap">{video.description}</p>;
      case "video_url":
        return (
          <div className="mt-2 ">
            {video?.type == "youtube" ? (
              <iframe
                width="560"
                height="315"
                src={video.video_url}
                title="YouTube Video"
                frameborder="2"
                allow="autoplay; encrypted-media"
              ></iframe>
            ) : (
              <>
                <Button
                  onPress={() => {
                    setCurrentVideo(video);
                    onOpenMediaModal();
                  }}
                >
                  Media
                </Button>
              </>
            )}
          </div>
        );
      case "action":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Edit user">
              <span
                onClick={() => {
                  setCurrentVideo(video);
                  onOpenEditVideo();
                }}
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
              >
                <Pencil />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <span
                onClick={() => {
                  onOpenDeleteVideo();
                  setCurrentVideo(video);
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
            </div>
            <div className="flex flex-1 justify-end">
              <Button onPress={onOpenAddVideo} color="primary">
                Add Video
              </Button>
            </div>
          </div>
          <DataTable
            data={videos}
            total={total}
            setPage={setPage}
            setToggleData={setToggleFetchVideos}
            columns={columns}
            renderCell={renderCell}
          />
        </div>
      </div>
      <CreateUpdateVideoModal
        isOpen={isOpenAddVideo}
        onClose={onCloseAddVideo}
        setToggleFetchVideos={setToggleFetchVideos}
      />
      <ConfirmModal
        isOpen={isOpenDeleteVideo}
        onClose={onCloseDeleteVideo}
        title="Are you sure you want to delete this Video"
        onConfirm={deleteVideo}
      />
      <CreateUpdateVideoModal
        isOpen={isOpenEditVideo}
        onClose={onCloseEditVideo}
        setToggleFetchVideos={setToggleFetchVideos}
        videoInfo={currentVideo}
      />
      <ViewMediaModal
        isOpen={isOpenMediaModal}
        onClose={onCloseMediaModal}
        url={currentVideo?.video_url}
        type="video"
      />
    </>
  );
};

export default VideoPage;

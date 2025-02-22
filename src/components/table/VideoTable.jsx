import { Chip, Pagination, Tooltip, useDisclosure } from "@heroui/react";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import React, { useCallback, useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import ConfirmModal from "../modals/ConfirmModal";
import { api } from "../../utils/apiClient";
import useToast from "../../hooks/useToast";
import CreateUpdateProductModal from "../modals/CreateUpdateProductModal";
import CreateUpdateVideoModal from "../modals/CreateUpdateVideoModal";

export const columns = [
  { name: "Title", uid: "title" },
  { name: "Description", uid: "description" },
  { name: "Type", uid: "type" },
  { name: "Category", uid: "category" },
  { name: "Video", uid: "video_url" },
  { name: "Action", uid: "action" },
];

const VideoTable = ({ videos, setToggleFetchVideos, total, setPage }) => {
  const { successToast, errorToast } = useToast();
  const [currentVideo, setCurrentVideo] = useState();
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
  const renderCell = useCallback((video, columnKey) => {
    const cellValue = video[columnKey];
    switch (columnKey) {
      case "description":
        return <p className="text-wrap">{video.description}</p>;
      case "video_url":
        return (
          <div className="mt-2 relative w-40 h-40 border rounded overflow-hidden">
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
                <video
                  src={video.video_url}
                  controls
                  className="w-full h-full object-cover"
                ></video>
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
    <div className="mt-10 space-y-10 text-black">
      <Table
        aria-label="Example table with custom cells "
        className="h-screen"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              initialPage={1}
              total={parseInt(total / 10) + 1}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={videos}>
          {(item) => (
            <TableRow key={item._id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
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
    </div>
  );
};

export default VideoTable;

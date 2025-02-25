import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { api } from "../../utils/apiClient";

const categoryOptions = ["Education", "Entertainment", "Technology", "Other"];
const typeOptions = ["general", "youtube", "subscribe"];

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  type: z.enum(["general", "youtube", "subscribe"]),
  video_url: z.string().url("Invalid URL").optional().or(z.string().length(0)),
  video_file: z
    .instanceof(FileList)
    .optional()
    .refine(
      (files) =>
        !files ||
        files.length === 0 ||
        ["video/mp4", "video/mkv"].includes(files[0]?.type),
      "Only .mp4 and .mkv formats are supported"
    )
    .refine(
      (files) =>
        !files || files.length === 0 || files[0]?.size < 50 * 1024 * 1024,
      "Video must be less than 50MB"
    ),
});

const CreateUpdateVideoModal = ({
  isOpen,
  onClose,
  videoInfo,
  setToggleFetchVideos,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      type: "general",
      video_url: "",
      video_file: undefined,
    },
  });

  const selectedType = watch("type");

  useEffect(() => {
    console.log("Form errors:", errors);
  }, [errors]);

  useEffect(() => {
    if (videoInfo) {
      reset({
        title: videoInfo.title,
        description: videoInfo.description,
        category: videoInfo.category,
        type: videoInfo.type,
        video_url: videoInfo.type === "youtube" ? videoInfo.video_url : "",
      });

      if (videoInfo.video_url && videoInfo.type !== "youtube") {
        setVideoPreview(videoInfo.video_url);
      }
    }
  }, [videoInfo, reset]);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const submitForm = async (data) => {
    console.log("data-->", data);
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("type", data.type);

      if (data.type === "youtube") {
        formData.append("video_url", data.video_url);
      } else if (data.video_file && data.video_file.length > 0) {
        formData.append("video", data.video_file[0]);
      }

      console.log("Form Data:", Object.fromEntries(formData));

      // Perform API request (replace with actual API call)
      if (videoInfo) {
        formData.append("id", videoInfo._id);
        const response = await api.put("/video", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("response123-->", response);
      } else {
        const response = await api.post("/video", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("response123333-->", response);
      }
      setToggleFetchVideos((prev) => !prev);
      onClose();
      reset();
      setVideoPreview(null);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit(submitForm)}>
        <ModalContent>
          <ModalHeader>
            {videoInfo ? "Edit Video" : "Upload New Video"}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Title"
                    placeholder="Enter title"
                    isInvalid={!!errors.title}
                    errorMessage={errors.title?.message}
                  />
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    label="Description"
                    placeholder="Enter description"
                    minRows={3}
                    isInvalid={!!errors.description}
                    errorMessage={errors.description?.message}
                  />
                )}
              />

              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Category"
                    placeholder="Select category"
                    isInvalid={!!errors.category}
                    errorMessage={errors.category?.message}
                  >
                    {categoryOptions.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />

              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Type"
                    placeholder="Select type"
                    isInvalid={!!errors.type}
                    errorMessage={errors.type?.message}
                    selectedKeys={field.value ? [field.value] : []}
                  >
                    {typeOptions.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />

              {selectedType === "youtube" ? (
                <Controller
                  name="video_url"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="YouTube Video URL"
                      placeholder="Paste YouTube URL"
                      isInvalid={!!errors.video_url}
                      errorMessage={errors.video_url?.message}
                      selectedKeys={field.value ? [field.value] : []}
                    />
                  )}
                />
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Upload Video</label>
                  <input
                    type="file"
                    accept="video/mp4,video/mkv"
                    {...register("video_file")}
                    onChange={handleVideoChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {errors.video_file && (
                    <p className="text-red-500 text-sm">
                      {errors.video_file.message}
                    </p>
                  )}
                  {videoPreview && (
                    <div className="mt-2 relative w-40 h-40 border rounded overflow-hidden">
                      <video
                        src={videoPreview}
                        controls
                        className="w-full h-full object-cover"
                      ></video>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        className="absolute top-1 right-1"
                        onPress={() => setVideoPreview(null)}
                      >
                        ✕
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="flat"
              onPress={onClose}
              type="button"
            >
              Cancel
            </Button>
            <Button color="primary" type="submit" isLoading={isUploading}>
              {videoInfo ? "Update Video" : "Upload Video"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default CreateUpdateVideoModal;

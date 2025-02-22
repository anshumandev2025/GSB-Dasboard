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

const categoryOptions = [
  "Vegan",
  "Vegetarian",
  "Keto",
  "Paleo",
  "Mediterranean",
  "Other",
];
const typeOptions = ["general", "subscribe"];

// Schema matching the Mongoose model
const schema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(categoryOptions, {
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
  type: z.enum(typeOptions, {
    errorMap: () => ({ message: "Please select a valid type" }),
  }),
  pdf_file: z
    .instanceof(FileList)
    .refine((files) => files?.length === 1, "PDF file is required")
    .refine(
      (files) => files?.[0]?.type === "application/pdf",
      "Only PDF files are allowed"
    )
    .refine(
      (files) => files?.[0]?.size <= 10 * 1024 * 1024,
      "PDF must be less than 10MB"
    ),
});

const CreateUpdateDietModal = ({
  isOpen,
  onClose,
  dietInfo,
  setToggleDiets,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [hasExistingPDF, setHasExistingPDF] = useState(false);

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
    setValue,
    register,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      category: "Vegan", // Default category
      type: "general", // Default type
      pdf_file: undefined,
    },
  });

  useEffect(() => {
    if (dietInfo) {
      reset({
        title: dietInfo.title || "",
        description: dietInfo.description || "",
        category: dietInfo.category || "Vegan",
        type: dietInfo.type || "general",
      });

      if (dietInfo.pdf_url) {
        setPdfPreview(dietInfo.pdf_url);
        setHasExistingPDF(true);
      }
    } else {
      reset({
        title: "",
        description: "",
        category: "Vegan",
        type: "general",
        pdf_file: undefined,
      });
      setPdfPreview(null);
      setHasExistingPDF(false);
    }
  }, [dietInfo, reset]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/pdf") {
        setPdfPreview(URL.createObjectURL(file));
        setHasExistingPDF(false);
      } else {
        // Reset file input if invalid type
        e.target.value = "";
        alert("Please upload only PDF files");
      }
    }
  };

  const submitForm = async (data) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("type", data.type);

      if (data.pdf_file && data.pdf_file.length > 0) {
        formData.append("file", data.pdf_file[0]);
      }

      console.log("Form Data:", Object.fromEntries(formData));
      const response = await api.post("/diet", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setToggleDiets((prev) => !prev);
      onClose();
      reset();
      setPdfPreview(null);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit(submitForm)} id="dietForm">
        <ModalContent>
          <ModalHeader>
            {dietInfo ? "Edit Diet Plan" : "Create New Diet Plan"}
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
                    selectedKeys={field.value ? [field.value] : []}
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
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Upload PDF</label>
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  {...register("pdf_file")}
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {errors.pdf_file && (
                  <p className="text-red-500 text-sm">
                    {errors.pdf_file.message}
                  </p>
                )}
                {pdfPreview && (
                  <div className="mt-2">
                    <object
                      data={pdfPreview}
                      type="application/pdf"
                      width="100%"
                      height="200px"
                      className="border rounded"
                    >
                      <p>PDF preview not available</p>
                    </object>
                    <Button
                      size="sm"
                      color="danger"
                      variant="flat"
                      className="mt-2"
                      onPress={() => {
                        setPdfPreview(null);
                        setValue("pdf_file", undefined);
                        setHasExistingPDF(false);
                      }}
                      type="button"
                    >
                      Remove PDF
                    </Button>
                  </div>
                )}
                {hasExistingPDF && dietInfo?.pdf_url && !pdfPreview && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Using existing PDF</p>
                    <object
                      data={dietInfo.pdf_url}
                      type="application/pdf"
                      width="100%"
                      height="200px"
                      className="border rounded mt-2"
                    >
                      <p>PDF preview not available</p>
                    </object>
                  </div>
                )}
              </div>
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
            <Button
              color="primary"
              type="submit"
              isLoading={isUploading}
              form="dietForm"
            >
              {dietInfo ? "Update Diet Plan" : "Create Diet Plan"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default CreateUpdateDietModal;

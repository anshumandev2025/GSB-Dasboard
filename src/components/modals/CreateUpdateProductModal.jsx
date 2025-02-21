import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { baseURL } from "../../utils/urls";
import useToast from "../../hooks/useToast";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";

const CreateUpdateProductModal = ({
  isOpen,
  onClose,
  productInfo,
  //   setToggleFetchProducts,
}) => {
  const { successToast, errorToast } = useToast();
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const categoryOptions = ["IBS", "Depression", "Anxitey"];
  const schema = z.object({
    product_name: z
      .string()
      .min(3, "Product name must be at least 3 characters"),
    product_price: z.coerce
      .number()
      .positive("Price must be a positive number"),
    product_descriptions: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    product_category: z.string().min(1, "Category is required"),
    product_image: z
      .instanceof(FileList)
      .refine((files) => {
        // Skip validation if no file is selected and we're in edit mode
        if (productInfo?.product_image && files.length === 0) return true;
        // Require file in create mode
        if (!productInfo && files.length === 0) return false;
        return true;
      }, "Image is required")
      .refine((files) => {
        if (files.length === 0) return true;
        return ["image/jpeg", "image/png", "image/jpg"].includes(
          files[0]?.type
        );
      }, "Only .jpg, .jpeg, and .png formats are supported.")
      .refine((files) => {
        if (files.length === 0) return true;
        return files[0]?.size < 5 * 1024 * 1024;
      }, "Image must be less than 5MB"),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      product_name: "",
      product_price: 0,
      product_descriptions: "",
      product_category: "",
      product_image: undefined,
    },
  });

  // Set default values when `productInfo` changes
  useEffect(() => {
    if (productInfo) {
      reset({
        product_name: productInfo.product_name || "",
        product_price: productInfo.product_price || 0,
        product_descriptions: productInfo.product_descriptions || "",
        product_category: productInfo.product_category || "",
      });

      // If there's an existing image, show it in preview
      if (productInfo.product_image) {
        setImagePreview(productInfo.product_image);
      }
    }
  }, [productInfo, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const submitForm = async (data) => {
    try {
      setIsUploading(true);
      console.log("data-->", data);
      console.log("category-->", categoryOptions[data.product_category]);
      // Create a FormData object to handle file upload
      const formData = new FormData();
      formData.append("name", data.product_name);
      formData.append("price", data.product_price);
      formData.append("description", data.product_descriptions);
      formData.append("category", categoryOptions[data.product_category]);

      // Only append image if a new one is selected
      if (data.product_image.length > 0) {
        formData.append("image", data.product_image[0]);
      }

      if (productInfo) {
        // Update existing product
        formData.append("product_id", productInfo._id);
        await axios.put(`${baseURL}/product`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        successToast("Product updated successfully");
      } else {
        // Create new product
        await axios.post(`${baseURL}/product`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        successToast("Product created successfully");
      }

      //   setToggleFetchProducts((prev) => !prev);
      onClose();
      reset();
      setImagePreview(null);
    } catch (error) {
      console.log("error-->", error);
      errorToast(error.response?.data?.message || "An error occurred");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} size="lg" onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {productInfo ? "Edit Product" : "Create New Product"}
            </ModalHeader>
            <ModalBody>
              <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
                <div>
                  <Input
                    label="Product Name"
                    placeholder="Enter product name"
                    {...register("product_name")}
                    isInvalid={!!errors.product_name}
                    errorMessage={errors.product_name?.message}
                  />
                </div>

                <div>
                  <Input
                    label="Product Price"
                    type="number"
                    placeholder="0.00"
                    {...register("product_price")}
                    isInvalid={!!errors.product_price}
                    errorMessage={errors.product_price?.message}
                  />
                </div>

                <div>
                  <Controller
                    name="product_descriptions"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        label="Product Description"
                        placeholder="Enter detailed product description"
                        minRows={3}
                        isInvalid={!!errors.product_descriptions}
                        errorMessage={errors.product_descriptions?.message}
                      />
                    )}
                  />
                </div>

                <div>
                  <Select
                    className="w-60"
                    placeholder="Select Category"
                    isInvalid={!!errors.product_category}
                    errorMessage={errors.product_category?.message}
                    {...register("product_category")}
                  >
                    {categoryOptions.map((filter, index) => (
                      <SelectItem key={index}>{filter}</SelectItem>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Image</label>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    {...register("product_image")}
                    onChange={(e) => {
                      handleImageChange(e);
                      register("product_image").onChange(e);
                    }}
                    className="block w-full text-sm text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary-50 file:text-primary-700
                      hover:file:bg-primary-100"
                  />
                  {errors.product_image && (
                    <p className="text-red-500 text-sm">
                      {errors.product_image.message}
                    </p>
                  )}

                  {imagePreview && (
                    <div className="mt-2 relative w-40 h-40 border rounded overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        className="absolute top-1 right-1"
                        onPress={() => {
                          setImagePreview(null);
                          setValue("product_image", new DataTransfer().files);
                        }}
                      >
                        ✕
                      </Button>
                    </div>
                  )}
                </div>

                <ModalFooter>
                  <Button
                    color="danger"
                    variant="flat"
                    onPress={() => {
                      onClose();
                      reset();
                      setImagePreview(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button color="primary" type="submit" isLoading={isUploading}>
                    {productInfo ? "Update Product" : "Create Product"}
                  </Button>
                </ModalFooter>
              </form>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreateUpdateProductModal;

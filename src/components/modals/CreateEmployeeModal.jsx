import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Input } from "@heroui/input";
import axios from "axios";
import { baseURL } from "../../utils/urls";
import useToast from "../../hooks/useToast";
const CreateEmployeeModal = ({
  isOpen,
  onClose,
  employeeInfo,
  setToggleFetchEmployees,
}) => {
  const { successToast, errorToast } = useToast();

  const schema = z
    .object({
      name: z.string().min(3, "Name must be at least 3 characters"),
      email: z.string().email("Invalid email address"),
      mobile: z
        .string()
        .length(10, "Mobile number must be 10 digits")
        .regex(/^\d+$/, "Mobile number must contain only digits"),
      password: employeeInfo
        ? z.string().optional()
        : z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: employeeInfo ? z.string().optional() : z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Set default values when `employeeInfo` changes
  useEffect(() => {
    if (employeeInfo) {
      reset({
        name: employeeInfo.employee_name || "",
        email: employeeInfo.employee_email_address || "",
        mobile: employeeInfo.employee_mobile_number || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [employeeInfo, reset]);

  const submitForm = async (data) => {
    try {
      if (employeeInfo) {
        await axios.put(`${baseURL}/employee`, {
          employee_id: employeeInfo._id,
          employee_name: data.name,
          employee_email_address: data.email,
          employee_mobile_number: data.mobile,
        });
        successToast("Employee update successfully");
        setToggleFetchEmployees((prev) => !prev);
      } else {
        await axios.post(`${baseURL}/employee`, {
          employee_name: data.name,
          employee_email_address: data.email,
          employee_mobile_number: data.mobile,
          employee_password: data.password,
        });
        successToast("Employee created successfully");
        setToggleFetchEmployees((prev) => !prev);
      }
      onClose();
    } catch (error) {
      console.log("error-->", error);
      errorToast(error.response.data.message);
    }
  };

  return (
    <Modal isOpen={isOpen} size="md" onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {employeeInfo ? "Edit Employee" : "Create New Employee"}
            </ModalHeader>
            <ModalBody>
              <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
                <div>
                  <Input label="Name" {...register("name")} />
                  {errors.name && (
                    <p className="text-red-500 text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Input label="Email" type="email" {...register("email")} />
                  {errors.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Input label="Mobile Number" {...register("mobile")} />
                  {errors.mobile && (
                    <p className="text-red-500 text-sm">
                      {errors.mobile.message}
                    </p>
                  )}
                </div>

                {!employeeInfo && (
                  <>
                    <div>
                      <Input
                        label="Password"
                        type="password"
                        {...register("password")}
                      />
                      {errors.password && (
                        <p className="text-red-500 text-sm">
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Input
                        label="Confirm Password"
                        type="password"
                        {...register("confirmPassword")}
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* Move the buttons inside the form to ensure proper form submission */}
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" type="submit">
                    {employeeInfo ? "Update" : "Create"}
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

export default CreateEmployeeModal;

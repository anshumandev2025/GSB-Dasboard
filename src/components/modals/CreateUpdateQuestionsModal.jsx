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
import { Switch } from "@heroui/switch";
import { Chip } from "@heroui/chip";
import { api } from "../../utils/apiClient";

const categoryOptions = [
  "General Knowledge",
  "Science",
  "Mathematics",
  "History",
  "Geography",
  "Other",
];

// Schema validation
const schema = z.object({
  question: z
    .string()
    .min(3, "Question must be at least 3 characters")
    .max(500, "Question must be less than 500 characters"),
  category: z.string().min(1, "Please select a category"),
  options: z
    .array(z.string())
    .min(2, "At least 2 options are required")
    .max(6, "Maximum 6 options allowed"),
  is_multiple_correct: z.boolean(),
});

const CreateUpdateQuestionModal = ({
  isOpen,
  onClose,
  questionInfo,
  setToggleFetchQuestions,
}) => {
  const [newOption, setNewOption] = useState("");
  const [options, setOptions] = useState([]);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      question: "",
      category: "",
      options: [],
      is_multiple_correct: false,
    },
  });

  // Watch for options changes to update validation
  const watchOptions = watch("options");

  useEffect(() => {
    if (questionInfo) {
      reset({
        question: questionInfo.question || "",
        category: questionInfo.category || "",
        options: questionInfo.options || [],
        is_multiple_correct: questionInfo.is_multiple_correct || false,
      });
      setOptions(questionInfo.options || []);
    } else {
      reset({
        question: "",
        category: "",
        options: [],
        is_multiple_correct: false,
      });
      setOptions([]);
    }
  }, [questionInfo, reset]);

  const handleAddOption = () => {
    if (newOption.trim() && options.length < 6) {
      const updatedOptions = [...options, newOption.trim()];
      setOptions(updatedOptions);
      setValue("options", updatedOptions);
      setNewOption("");
    }
  };

  const handleRemoveOption = (indexToRemove) => {
    const updatedOptions = options.filter(
      (_, index) => index !== indexToRemove
    );
    setOptions(updatedOptions);
    setValue("options", updatedOptions);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddOption();
    }
  };

  const onSubmit = async (data) => {
    try {
      console.log("Submitting question:", data);
      const payload = {
        question: data.question,
        options: data.options,
        is_multiple_correct: data.is_multiple_correct,
        category: data.category,
      };

      console.log("payload-->", payload);
      const response = await api.post("/question", payload);
      setToggleFetchQuestions((prev) => !prev);
      onClose();
      reset();
      setOptions([]);
    } catch (error) {
      console.error("Error submitting question:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} id="questionForm">
        <ModalContent>
          <ModalHeader>
            {questionInfo ? "Edit Question" : "Create New Question"}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Controller
                name="question"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    label="Question"
                    placeholder="Enter your question"
                    minRows={3}
                    isInvalid={!!errors.question}
                    errorMessage={errors.question?.message}
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

              <div className="space-y-2">
                <label className="text-sm font-medium">Options</label>
                <div className="flex gap-2 items-center">
                  <Input
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    onKeyUp={handleKeyPress}
                    placeholder="Enter an option"
                    className="flex-1"
                    isDisabled={options.length >= 6}
                  />
                  <Button
                    type="button"
                    color="primary"
                    onPress={handleAddOption}
                    isDisabled={!newOption.trim() || options.length >= 6}
                  >
                    Add
                  </Button>
                </div>
                {errors.options && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.options.message}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {options.map((option, index) => (
                    <Chip
                      key={index}
                      onClose={() => handleRemoveOption(index)}
                      variant="flat"
                      className="bg-blue-100"
                    >
                      {option}
                    </Chip>
                  ))}
                </div>
                {options.length === 6 && (
                  <p className="text-amber-600 text-sm">
                    Maximum number of options reached (6)
                  </p>
                )}
              </div>

              <Controller
                name="is_multiple_correct"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center gap-2">
                    <Switch
                      {...field}
                      checked={field.value}
                      onChange={field.onChange}
                    />
                    <label className="text-sm font-medium">
                      Allow multiple correct answers
                    </label>
                  </div>
                )}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="flat"
              onPress={() => {
                onClose();
                reset();
                setOptions([]);
              }}
              type="button"
            >
              Cancel
            </Button>
            <Button color="primary" type="submit" form="questionForm">
              {questionInfo ? "Update Question" : "Create Question"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default CreateUpdateQuestionModal;

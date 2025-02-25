import React, { useCallback, useEffect, useState } from "react";
import Header from "../components/common/Header";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";
import DataTable from "../components/table/DataTable";
import { api } from "../utils/apiClient";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import { Pencil, Trash2 } from "lucide-react";
import CreateUpdateQuestionModal from "../components/modals/CreateUpdateQuestionsModal";
import ConfirmModal from "../components/modals/ConfirmModal";
import useToast from "../hooks/useToast";

const QuestionsPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const [questions, setQuestions] = useState([]);
  const [total, setTotal] = useState(10);
  const [page, setPage] = useState(1);
  const [toggleQuestion, setToggleQuestions] = useState(false);
  const [search, setSearch] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState("");
  const { successToast, errorToast } = useToast();
  const columns = [
    { name: "Question", uid: "question" },
    { name: "Category", uid: "category" },
    { name: "Options", uid: "options" },
    { name: "Multipe correct", uid: "is_multiple_correct" },
    { name: "Action", uid: "action" },
  ];
  const renderCell = useCallback((data, columnKey) => {
    const cellValue = data[columnKey];
    switch (columnKey) {
      case "options":
        return (
          <div className="flex gap-5 flex-wrap">
            {data.options.map((label, index) => (
              <Chip key={index}>{label}</Chip>
            ))}
          </div>
        );
      case "is_multiple_correct":
        return (
          <Chip color={data.is_multiple_correct ? "success" : "danger"}>
            {data.is_multiple_correct ? "True" : "False"}
          </Chip>
        );
      case "action":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Edit question">
              <span
                onClick={() => {
                  onOpenEdit();
                  setCurrentQuestion(data);
                }}
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
              >
                <Pencil />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete question">
              <span
                onClick={() => {
                  onOpenDelete();
                  setCurrentQuestion(data);
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
  const deleteQuestion = async () => {
    try {
      await api.delete(`/question/${currentQuestion._id}`);
      successToast("Delete question successfully");
      setToggleQuestions((prev) => !prev);
    } catch (error) {
      console.log("error-->", error);
    }
  };
  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await api.get(
        `/question?page=${page}&limit=10&search=${search}`
      );
      setQuestions(response.data.data);
      setTotal(response.data.total);
    };
    fetchQuestions();
  }, [toggleQuestion, page, search]);
  return (
    <>
      <div className="flex-1 overflow-auto relative z-10">
        <Header title="Questions" />
        <div className="p-10">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex items-center gap-10">
              <Input
                className="max-w-[300px] text-black"
                variant="flat"
                placeholder="Search here..."
                type="text"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-1 justify-end">
              <Button onPress={onOpen} color="primary">
                Add Questions
              </Button>
            </div>
          </div>
          <DataTable
            data={questions}
            total={total}
            setToggleData={setToggleQuestions}
            setPage={setPage}
            columns={columns}
            renderCell={renderCell}
          />
        </div>
        <CreateUpdateQuestionModal
          isOpen={isOpen}
          onClose={onClose}
          setToggleFetchQuestions={setToggleQuestions}
        />
        <CreateUpdateQuestionModal
          isOpen={isOpenEdit}
          onClose={onCloseEdit}
          setToggleFetchQuestions={setToggleQuestions}
          questionInfo={currentQuestion}
        />
        <ConfirmModal
          isOpen={isOpenDelete}
          onClose={onCloseDelete}
          title="Are you sure you want to delete this question?"
          onConfirm={deleteQuestion}
        />
      </div>
    </>
  );
};

export default QuestionsPage;

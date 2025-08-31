"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import ConfirmDelete from "./confirm-delete";
import { Button } from "./ui/button";
import { EditIcon, MoreHorizontal, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import ModalTemplate from "./modal-template";
import CreateWorkLogForm from "./forms/create-work-log-form";
import type { CompanyFromQuery, WorkLogFromQuery } from "@/db/schema";
import { deleteWorkLog } from "@/actions/delete-work-log";

type WorkLogActionsProps = {
  workLogToEdit: WorkLogFromQuery;
  companies?: CompanyFromQuery[];
  mode: "single" | "dashboard";
};

const WorkLogActions = ({
  workLogToEdit,
  mode,
  companies,
}: WorkLogActionsProps) => {
  const [isPending, startTransition] = useTransition();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      await deleteWorkLog(workLogToEdit.id);
      setIsDeleteModalOpen(false);
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              setIsEditModalOpen(true);
            }}
          >
            <EditIcon className="mr-2 h-4 w-4" />
            Edit Work log
          </DropdownMenuItem>
          <DropdownMenuItem
            className="mt-2"
            onClick={(e) => {
              e.preventDefault();
              setIsDeleteModalOpen(true);
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Work Log
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ModalTemplate
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Edit Work Log"
        className="md:max-w-2xl"
      >
        <CreateWorkLogForm
          workLogToEdit={workLogToEdit}
          mode={mode}
          companies={companies}
          onSuccess={() => setIsEditModalOpen(false)}
        />
      </ModalTemplate>

      <ConfirmDelete
        onClick={handleDelete}
        isActionHappening={isPending}
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        text="Are you sure you want to delete this work log ?"
        title="Delete Work Log"
      />
    </>
  );
};

export default WorkLogActions;

"use client";

import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import ConfirmDelete from "./confirm-delete";
import { deleteCurrentMonthWorkLogs } from "@/actions/delete-current-month-work-log";
import { Trash2 } from "lucide-react";

type DeleteMonthlyWorkLogsButtonProps = {
  companyId: string;
};

const DeleteMonthlyWorkLogsButton = ({
  companyId,
}: DeleteMonthlyWorkLogsButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      await deleteCurrentMonthWorkLogs(companyId);
      setOpen(false);
    });
  };

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setOpen(true)}
        disabled={isPending}
        size="sm"
        className="flex-1 max-sm:w-full"
      >
        <Trash2 />
      </Button>

      <ConfirmDelete
        open={open}
        onOpenChange={setOpen}
        onClick={handleDelete}
        isActionHappening={isPending}
        title="Delete Current Month Logs"
        text="Are you sure you want to delete all work logs for this company for the current month? This action cannot be undone."
      />
    </>
  );
};

export default DeleteMonthlyWorkLogsButton;

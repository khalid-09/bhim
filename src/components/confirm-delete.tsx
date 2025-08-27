"use client";

import { Button } from "@/components/ui/button";
import ModalTemplate from "@/components/modal-template";
import { DialogClose } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

type ConfirmDeleteProps = {
  title: string;
  modalTrigger: React.ReactNode | string;
  onClick?: () => void;
  text: string;
  open?: boolean;
  isActionHappening?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const ConfirmDelete = ({
  title,
  modalTrigger,
  isActionHappening,
  onClick,
  text,
  open,
  onOpenChange,
}: ConfirmDeleteProps) => {
  const isControlled = open !== undefined && onOpenChange !== undefined;

  const dialogProps = isControlled ? { open, onOpenChange } : {};

  return (
    <ModalTemplate
      {...dialogProps}
      classNameTitle="font-cabinet-grotesk"
      title={title}
      triggerAsChild
      modalTrigger={modalTrigger}
    >
      <div className="mx-5 space-y-5 border-t pt-5 pb-5.5">
        <p>{text}</p>
        <div className="flex items-center justify-end gap-2.5">
          <DialogClose asChild>
            <Button
              disabled={isActionHappening}
              variant="secondary"
              className="h-11"
              size="lg"
            >
              Cancel{" "}
            </Button>
          </DialogClose>
          <Button
            disabled={isActionHappening}
            size="lg"
            className="h-11"
            onClick={() => onClick?.()}
            variant="destructive"
          >
            {isActionHappening && (
              <Loader2
                className="mr-2 animate-spin"
                size={20}
                aria-hidden="true"
              />
            )}{" "}
            Delete
          </Button>
        </div>
      </div>
    </ModalTemplate>
  );
};

export default ConfirmDelete;

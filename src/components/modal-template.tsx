import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

type ModalTemplateProps = {
  title: string;
  modalTrigger?: string | React.ReactNode;
  triggerAsChild?: boolean;
  className?: string;
  classNameTitle?: string;
  classNameHeader?: string;
  srDescription?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideScrollAreaOnMobile?: boolean;
};

const ModalTemplate = ({
  title,
  children,
  modalTrigger = "Open",
  triggerAsChild,
  className,
  classNameTitle,
  classNameHeader,
  srDescription,
  open,
  onOpenChange,
  hideScrollAreaOnMobile = false,
}: PropsWithChildren<ModalTemplateProps>) => {
  const isControlled = open !== undefined && onOpenChange !== undefined;

  const dialogProps = isControlled ? { open, onOpenChange } : {};

  const content = (
    <>
      <DialogHeader
        className={cn("mb-5 gap-0 px-4 pt-5.5 pb-0", classNameHeader)}
      >
        <DialogTitle
          className={cn("text-start text-xl font-medium", classNameTitle)}
        >
          {title}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {srDescription}
        </DialogDescription>
      </DialogHeader>
      {children}
    </>
  );

  return (
    <Dialog {...dialogProps}>
      {(!isControlled || modalTrigger) && (
        <DialogTrigger asChild={triggerAsChild}>{modalTrigger}</DialogTrigger>
      )}
      <DialogContent className={cn("bg-muted mb-0 gap-0 p-0", className)}>
        {hideScrollAreaOnMobile ? (
          <>
            <div className="max-h-[90vh] sm:hidden">{content}</div>
            <ScrollArea className="max-h-[90vh] max-sm:hidden">
              {content}
            </ScrollArea>
          </>
        ) : (
          <ScrollArea className="max-h-[90vh]">{content}</ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModalTemplate;

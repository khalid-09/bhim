"use client";

import { deleteCompany } from "@/actions/delete-company";
import ConfirmDelete from "@/components/confirm-delete";
import CreateCompanyForm from "@/components/forms/create-company-form";
import ModalTemplate from "@/components/modal-template";
import { Button } from "@/components/ui/button";
import type { CompanyFromQuery } from "@/db/schema";
import { EditIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type CompanyActionsProps = {
  company: CompanyFromQuery;
};

const CompanyActions = ({ company }: CompanyActionsProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = () => {
    if (!company.id) return;

    startTransition(async () => {
      await deleteCompany(company.id);
    });

    router.push("/dashboard/company");
  };

  return (
    <div className="flex items-center gap-3">
      <ModalTemplate
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Edit Company"
        triggerAsChild
        className="md:max-w-2xl"
        modalTrigger={
          <Button
            onClick={() => setIsEditModalOpen(true)}
            variant="secondary"
            className="border"
          >
            <EditIcon /> <span className="max-md:hidden">Edit Company</span>
          </Button>
        }
      >
        <CreateCompanyForm
          companyToEdit={company}
          onSuccess={() => setIsEditModalOpen(false)}
        />
      </ModalTemplate>
      <ConfirmDelete
        onClick={handleDelete}
        isActionHappening={isPending}
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        modalTrigger={
          <Button
            onClick={() => setIsDeleteModalOpen(true)}
            variant="destructive"
            className="border"
          >
            <Trash2Icon />
            <span className="max-md:hidden">Delete Company</span>
          </Button>
        }
        title="Delete company"
        text="Are you sure you want to delete this company?. All qualities of this company & added work log would be deleted."
      />
    </div>
  );
};

export default CompanyActions;

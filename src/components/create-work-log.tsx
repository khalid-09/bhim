"use client";

import { useState } from "react";
import ModalTemplate from "./modal-template";
import { Button } from "./ui/button";
import CreateWorkLogForm from "./forms/create-work-log-form";
import type { CompanyFromQuery } from "@/db/schema";

type CreateWorkLogProps = {
  company?: CompanyFromQuery;
  companies?: CompanyFromQuery[];
  mode: "single" | "dashboard";
};

const CreateWorkLog = ({ company, companies, mode }: CreateWorkLogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ModalTemplate
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Create Work Log"
      triggerAsChild
      className="md:max-w-2xl"
      modalTrigger={
        <Button className="bg-blue-600 text-white hover:bg-blue-700">
          Create Work log
        </Button>
      }
    >
      <CreateWorkLogForm
        onSuccess={() => setIsOpen(false)}
        prefilledCompany={company}
        companies={companies}
        mode={mode}
      />
    </ModalTemplate>
  );
};

export default CreateWorkLog;

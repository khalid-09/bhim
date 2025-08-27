"use client";

import CreateCompanyForm from "@/components/forms/create-company-form";
import ModalTemplate from "@/components/modal-template";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const CreateCompany = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ModalTemplate
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Create Company"
      triggerAsChild
      className="md:max-w-2xl"
      modalTrigger={
        <Button className="bg-blue-600 text-white hover:bg-blue-700">
          Create Company
        </Button>
      }
    >
      <CreateCompanyForm onSuccess={() => setIsOpen(false)} />
    </ModalTemplate>
  );
};

export default CreateCompany;

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, Loader2 } from "lucide-react";
import {
  createCompanyWithQualitiesSchema,
  type CreateCompanyWithQualitiesSchema,
} from "@/lib/validation/company";
import { createCompany } from "@/actions/create-company";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import type { CompanyFromQuery } from "@/db/schema";
import { editCompany } from "@/actions/edit-company";

type CreateCompanyFormProps = {
  companyToEdit?: CompanyFromQuery;
  onSuccess: () => void;
};

const CreateCompanyForm = ({
  companyToEdit,
  onSuccess,
}: CreateCompanyFormProps) => {
  const isMobile = useIsMobile();
  const [isPending, startTransition] = useTransition();
  const form = useForm<CreateCompanyWithQualitiesSchema>({
    resolver: zodResolver(createCompanyWithQualitiesSchema),
    defaultValues: {
      company: {
        name: companyToEdit?.name ?? "",
      },
      qualities: companyToEdit?.qualities ?? [
        {
          id: undefined,
          name: "",
          payableRate: "",
          receivableRate: "",
        },
      ],
    },
  });

  const {
    control,
    formState: { errors },
    getValues,
    handleSubmit,
  } = form;

  const qualities = getValues("qualities");

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "qualities",
  });

  const onSubmit = (values: CreateCompanyWithQualitiesSchema) => {
    startTransition(async () => {
      try {
        if (companyToEdit?.id) {
          await editCompany(values, companyToEdit.id);
          return;
        }
        await createCompany(values);
      } catch (error) {
        console.error(error);
      } finally {
        onSuccess?.();
      }
    });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 pb-4">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={control}
            name="company.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input className="bg-white" disabled={isPending} {...field} />
                </FormControl>
                <FormDescription>
                  Enter the name of your company.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between">
            <h5>Qualities</h5>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              className="bg-white"
              onClick={() =>
                append({
                  name: "",
                  payableRate: "",
                  receivableRate: "",
                })
              }
            >
              <Plus className="mr-1" />
              Add Quality
            </Button>
          </div>
          <ScrollArea
            className={cn(
              isMobile
                ? qualities.length >= 2 && "h-[450px]"
                : qualities.length >= 3 && "h-[450px]",
            )}
          >
            {fields.map((field, index) => {
              const hasPayableError = errors.qualities?.[index]?.payableRate;
              const hasReceivableError =
                errors.qualities?.[index]?.receivableRate;
              const hasNameError = errors.qualities?.[index]?.name;

              return (
                <Card key={field.id} className="mb-4 gap-3 p-4 last:mb-0">
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-medium">Quality {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <FormField
                      control={control}
                      name={`qualities.${index}.name`}
                      render={({ field }) => (
                        <FormItem
                          className={cn(
                            (hasPayableError || hasReceivableError) &&
                              "md:mb-6",
                          )}
                        >
                          <FormLabel>Quality Name</FormLabel>
                          <FormControl>
                            <Input disabled={isPending} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`qualities.${index}.payableRate`}
                      render={({ field }) => (
                        <FormItem
                          className={cn(
                            (hasNameError || hasReceivableError) && "md:mb-6",
                          )}
                        >
                          <FormLabel>Payable Rate</FormLabel>
                          <FormControl>
                            <Input disabled={isPending} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`qualities.${index}.receivableRate`}
                      render={({ field }) => (
                        <FormItem
                          className={cn(
                            (hasNameError || hasPayableError) && "md:mb-6",
                          )}
                        >
                          <FormLabel>Receivable Rate</FormLabel>
                          <FormControl>
                            <Input disabled={isPending} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              );
            })}
          </ScrollArea>
          <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <Loader2 className="mr-2 animate-spin" />}{" "}
            {companyToEdit?.id ? "Edit" : "Create"} Company
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateCompanyForm;

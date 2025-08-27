"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect, useTransition } from "react";
import { CheckIcon, ChevronsUpDownIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import {
  createWorkLogSingleCompanySchema,
  createWorkLogDashboardSchema,
  type CreateWorkLogSingleCompany,
  type CreateWorkLogDashboard,
} from "@/lib/validation/work-log";
import { type CompanyFromQuery } from "@/db/schema";
import { Label } from "../ui/label";
import { createWorkLog } from "@/actions/create-work-log";

type CreateWorkLogFormProps = {
  onSuccess: () => void;
  prefilledCompany?: CompanyFromQuery;
  companies?: CompanyFromQuery[];
  mode: "single" | "dashboard";
};

const CreateWorkLogForm = ({
  onSuccess,
  prefilledCompany,
  companies = [],
  mode,
}: CreateWorkLogFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
    prefilledCompany?.id || "",
  );
  const [companyOpen, setCompanyOpen] = useState(false);
  const [qualityOpen, setQualityOpen] = useState(false);

  const schema =
    mode === "single"
      ? createWorkLogSingleCompanySchema
      : createWorkLogDashboardSchema;

  const form = useForm<CreateWorkLogSingleCompany | CreateWorkLogDashboard>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date(),
      machineNo: "",
      taar: "",
      karigarName: "",
      qualityId: "",
      ...(mode === "dashboard" && { companyId: "" }),
    },
  });

  const availableQualities = selectedCompanyId
    ? prefilledCompany?.qualities ||
      companies.find((c) => c.id === selectedCompanyId)?.qualities ||
      []
    : [];

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (mode === "dashboard" && selectedCompanyId) {
      setValue("qualityId", "");
    }
  }, [selectedCompanyId, setValue, mode]);

  const onSubmit = (
    values: CreateWorkLogSingleCompany | CreateWorkLogDashboard,
  ) => {
    startTransition(async () => {
      try {
        const serverData = {
          ...values,
          companyId:
            mode === "single"
              ? prefilledCompany!.id
              : (values as CreateWorkLogDashboard).companyId,
        };
        await createWorkLog(serverData);
        onSuccess();
      } catch (error) {
        console.error("Error creating work log:", error);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-4 pb-4">
        {mode === "dashboard" && (
          <FormField
            control={control}
            name="companyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <Popover open={companyOpen} onOpenChange={setCompanyOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        disabled={isPending}
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? companies.find(
                              (company) => company.id === field.value,
                            )?.name
                          : "Select company..."}
                        <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search company" />
                      <CommandList>
                        <CommandEmpty>No company found.</CommandEmpty>
                        <CommandGroup>
                          {companies.map((company) => (
                            <CommandItem
                              className="flex items-center justify-between"
                              key={company.id}
                              value={company.name}
                              onSelect={() => {
                                field.onChange(company.id);
                                setSelectedCompanyId(company.id);
                                setCompanyOpen(false);
                              }}
                            >
                              {company.name}
                              <CheckIcon
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  company.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {mode === "single" && prefilledCompany && (
          <div className="w-full space-y-2">
            <Label>Company</Label>
            <Input
              value={prefilledCompany.name}
              disabled
              className="disabled:opacity-100"
            />
          </div>
        )}

        <FormField
          control={control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      disabled={isPending}
                      className={cn(
                        "w-full pl-3 text-left text-sm font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    autoFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="qualityId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quality</FormLabel>
              <Popover open={qualityOpen} onOpenChange={setQualityOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      disabled={!selectedCompanyId || isPending}
                      className={cn(
                        "w-full justify-between bg-white",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value
                        ? availableQualities.find(
                            (quality) => quality.id === field.value,
                          )?.name
                        : selectedCompanyId
                          ? "Select quality"
                          : "Select company first..."}
                      <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search quality..." />
                    <CommandList>
                      <CommandEmpty>No quality found.</CommandEmpty>
                      <CommandGroup>
                        {availableQualities.map((quality) => (
                          <CommandItem
                            key={quality.id}
                            value={quality.name}
                            className="flex items-center justify-between"
                            onSelect={() => {
                              field.onChange(quality.id);
                              setQualityOpen(false);
                            }}
                          >
                            <span>{quality.name}</span>
                            <CheckIcon
                              className={cn(
                                "h-4 w-4",
                                quality.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center gap-4">
          <FormField
            control={control}
            name="machineNo"
            render={({ field }) => (
              <FormItem
                className={cn(
                  "w-full",
                  errors.taar && !errors.machineNo && "mb-7",
                )}
              >
                <FormLabel>Machine No.</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="Enter machine no."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="taar"
            render={({ field }) => (
              <FormItem
                className={cn(
                  "w-full",
                  errors.machineNo && !errors.taar && "mb-7",
                )}
              >
                <FormLabel>Taar</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="Enter taar."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="karigarName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Karigar Name</FormLabel>
              <FormControl>
                <Input
                  disabled={isPending}
                  placeholder="Enter karigar name..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending && <Loader2 className="mr-2 animate-spin" />} Create Work
          Log
        </Button>
      </form>
    </Form>
  );
};

export default CreateWorkLogForm;

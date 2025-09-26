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
import { type CompanyFromQuery, type WorkLogFromQuery } from "@/db/schema";
import { Label } from "../ui/label";
import { createWorkLog } from "@/actions/create-work-log";
import { editWorkLog } from "@/actions/edit-work-log";

type CreateWorkLogFormProps = {
  onSuccess: () => void;
  prefilledCompany?: CompanyFromQuery;
  companies?: CompanyFromQuery[];
  mode: "single" | "dashboard";
  workLogToEdit?: WorkLogFromQuery;
};

const CreateWorkLogForm = ({
  onSuccess,
  prefilledCompany,
  companies = [],
  workLogToEdit,
  mode,
}: CreateWorkLogFormProps) => {
  const [isPending, startTransition] = useTransition();

  // Determine if this is edit mode
  const isEditMode = !!workLogToEdit;

  // Set initial company ID
  const getInitialCompanyId = () => {
    if (isEditMode && workLogToEdit) {
      return workLogToEdit.company.id;
    }
    if (mode === "single" && prefilledCompany) {
      return prefilledCompany.id;
    }
    return "";
  };

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(
    getInitialCompanyId(),
  );
  const [companyOpen, setCompanyOpen] = useState(false);
  const [qualityOpen, setQualityOpen] = useState(false);

  const schema =
    mode === "single"
      ? createWorkLogSingleCompanySchema
      : createWorkLogDashboardSchema;

  // Get the company to display for single mode
  const displayCompany = isEditMode ? workLogToEdit.company : prefilledCompany;

  const form = useForm<CreateWorkLogSingleCompany | CreateWorkLogDashboard>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: isEditMode && workLogToEdit ? workLogToEdit.date : new Date(),
      machineNo: isEditMode && workLogToEdit ? workLogToEdit.machineNo : "",
      taar: isEditMode && workLogToEdit ? workLogToEdit.taar : "",
      karigarName: isEditMode && workLogToEdit ? workLogToEdit.karigarName : "",
      qualityId: isEditMode && workLogToEdit ? workLogToEdit.quality.id : "",
      ...(mode === "dashboard" && {
        companyId: isEditMode && workLogToEdit ? workLogToEdit.company.id : "",
      }),
    },
  });

  // Get available qualities based on selected company
  // In your CreateWorkLogForm, update the availableQualities logic:
  const availableQualities = selectedCompanyId
    ? (() => {
        // For edit mode in single company, use the company's qualities from workLogToEdit
        if (
          mode === "single" &&
          isEditMode &&
          workLogToEdit?.company?.qualities
        ) {
          return workLogToEdit.company.qualities;
        }

        // For create mode in single company, use prefilled company qualities
        if (mode === "single" && prefilledCompany?.qualities) {
          return prefilledCompany.qualities;
        }

        // For dashboard mode, find company from companies array
        const company = companies.find((c) => c.id === selectedCompanyId);
        return company?.qualities || [];
      })()
    : [];

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = form;

  // Effect to handle company selection changes in dashboard mode
  useEffect(() => {
    if (mode === "dashboard" && selectedCompanyId && !isEditMode) {
      setValue("qualityId", "");
    }
  }, [selectedCompanyId, setValue, mode, isEditMode]);

  const onSubmit = (
    values: CreateWorkLogSingleCompany | CreateWorkLogDashboard,
  ) => {
    startTransition(async () => {
      try {
        const serverData = {
          ...values,
          companyId: isEditMode
            ? workLogToEdit.company.id
            : mode === "single"
              ? prefilledCompany?.id || ""
              : (values as CreateWorkLogDashboard).companyId,
        };

        if (isEditMode && workLogToEdit) {
          await editWorkLog(workLogToEdit.id, serverData);
          return;
        }

        await createWorkLog(serverData);
      } catch (error) {
        console.error(
          `Error ${isEditMode ? "updating" : "creating"} work log:`,
          error,
        );
      } finally {
        onSuccess();
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-4 pb-4">
        {/* Company field for dashboard mode */}
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
                            )?.name ||
                            (isEditMode
                              ? workLogToEdit?.company.name
                              : "Select company...")
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

        {/* Company field for single mode - always show, disabled */}
        {mode === "single" && displayCompany && (
          <div className="w-full space-y-2">
            <Label>Company</Label>
            <Input
              value={displayCompany.name}
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
                          )?.name ||
                          (isEditMode
                            ? workLogToEdit?.quality.name
                            : "Select quality")
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
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value)}
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
          {isPending && <Loader2 className="mr-2 animate-spin" />}
          {isEditMode ? "Update Work Log" : "Create Work Log"}
        </Button>
      </form>
    </Form>
  );
};

export default CreateWorkLogForm;

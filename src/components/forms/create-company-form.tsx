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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import {
  createCompanyWithQualitiesSchema,
  type CreateCompanyWithQualitiesSchema,
} from "@/lib/validation";

export function CreateCompanyForm() {
  const form = useForm<CreateCompanyWithQualitiesSchema>({
    resolver: zodResolver(createCompanyWithQualitiesSchema),
    defaultValues: {
      company: {
        name: "",
      },
      qualities: [
        {
          name: "",
          payableRate: "",
          receivableRate: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "qualities",
  });

  const onSubmit = async (values: CreateCompanyWithQualitiesSchema) => {
    console.log(res);
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="company.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter company name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the name of your company.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="p-2 py-3">
            <CardHeader className="flex items-center justify-between px-3">
              <CardTitle>Qualities</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    name: "",
                    payableRate: "",
                    receivableRate: "",
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Quality
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 p-2">
              {fields.map((field, index) => (
                <Card key={field.id} className="p-4">
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
                      control={form.control}
                      name={`qualities.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quality Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter quality name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`qualities.${index}.payableRate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payable Rate</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter payable rate"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`qualities.${index}.receivableRate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Receivable Rate</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter receivable rate"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>

          <Button type="submit" className="w-full">
            Create Company
          </Button>
        </form>
      </Form>
    </div>
  );
}

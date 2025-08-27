"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { CompanyFromQuery } from "@/db/schema";
import { Button } from "./ui/button";
import { ArrowUpDownIcon } from "lucide-react";

export const columns: ColumnDef<CompanyFromQuery>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-muted-foreground text-xs font-medium tracking-wider uppercase hover:bg-inherit has-[>svg]:px-0"
      >
        Company
        <ArrowUpDownIcon className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const company = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="size-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-medium text-white md:size-6" />
          <span className="text-foreground text-sm font-medium">
            {company.name}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "qualities",
    header: () => (
      <div className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
        Qualities
      </div>
    ),
    cell: ({ row }) => {
      const qualities = row.getValue(
        "qualities",
      ) as CompanyFromQuery["qualities"];
      const rowIndex = row.index;

      const getQualityColor = (index: number) => {
        const adjustedIndex = (index + rowIndex) % 7;

        if (adjustedIndex === 0)
          return "bg-blue-100 text-blue-800 hover:bg-blue-200";
        if (adjustedIndex === 1)
          return "bg-orange-100 text-orange-800 hover:bg-orange-200";
        if (adjustedIndex === 2)
          return "bg-purple-100 text-purple-800 hover:bg-purple-200";
        if (adjustedIndex === 3)
          return "bg-green-100 text-green-800 hover:bg-green-200";
        if (adjustedIndex === 4)
          return "bg-indigo-100 text-indigo-800 hover:bg-indigo-200";
        if (adjustedIndex === 5)
          return "bg-pink-100 text-pink-800 hover:bg-pink-200";
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      };

      return (
        <>
          <div className="hidden max-w-md flex-wrap gap-1.5 lg:flex">
            {qualities.slice(0, 4).map((quality, index) => (
              <Badge
                key={quality.id}
                variant="secondary"
                className={`border-0 px-2.5 py-1 text-xs font-medium ${getQualityColor(index)}`}
              >
                {quality.name}
              </Badge>
            ))}
            {qualities.length > 4 && (
              <Badge
                variant="outline"
                className="text-muted-foreground border-muted-foreground/30 px-2 py-1 text-xs font-medium"
              >
                +{qualities.length - 4}
              </Badge>
            )}
          </div>

          <div className="hidden max-w-md flex-wrap gap-1.5 md:flex lg:hidden">
            {qualities.slice(0, 3).map((quality, index) => (
              <Badge
                key={quality.id}
                variant="secondary"
                className={`border-0 px-2.5 py-1 text-xs font-medium ${getQualityColor(index)}`}
              >
                {quality.name}
              </Badge>
            ))}
            {qualities.length > 3 && (
              <Badge
                variant="outline"
                className="text-muted-foreground border-muted-foreground/30 px-2 py-1 text-xs font-medium"
              >
                +{qualities.length - 3}
              </Badge>
            )}
          </div>

          <div className="hidden max-w-md flex-wrap gap-1.5 sm:flex md:hidden">
            {qualities.slice(0, 2).map((quality, index) => (
              <Badge
                key={quality.id}
                variant="secondary"
                className={`border-0 px-2.5 py-1 text-xs font-medium ${getQualityColor(index)}`}
              >
                {quality.name}
              </Badge>
            ))}
            {qualities.length > 2 && (
              <Badge
                variant="outline"
                className="text-muted-foreground border-muted-foreground/30 px-2 py-1 text-xs font-medium"
              >
                +{qualities.length - 2}
              </Badge>
            )}
          </div>

          <div className="flex max-w-md flex-wrap gap-1.5 sm:hidden">
            {qualities.slice(0, 1).map((quality, index) => (
              <Badge
                key={quality.id}
                variant="secondary"
                className={`border-0 px-2.5 py-1 text-xs font-medium ${getQualityColor(index)}`}
              >
                {quality.name}
              </Badge>
            ))}
            {qualities.length > 1 && (
              <Badge
                variant="outline"
                className="text-muted-foreground border-muted-foreground/30 px-2 py-1 text-xs font-medium"
              >
                +{qualities.length - 1}
              </Badge>
            )}
          </div>
        </>
      );
    },
    enableSorting: false,
  },
];

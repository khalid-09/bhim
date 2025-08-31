"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { CompanyFromQuery } from "@/db/schema";
import { Button } from "./ui/button";
import { ArrowUpDownIcon } from "lucide-react";
import { getQualityColor } from "@/lib/utils";

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

      return (
        <>
          <div className="hidden max-w-md flex-wrap gap-1.5 lg:flex">
            {qualities.slice(0, 4).map((quality, index) => (
              <Badge
                key={quality.id}
                variant="secondary"
                className={`border-0 px-2.5 py-1 text-xs font-medium ${getQualityColor(index, rowIndex)}`}
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
                className={`border-0 px-2.5 py-1 text-xs font-medium ${getQualityColor(index, rowIndex)}`}
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
                className={`border-0 px-2.5 py-1 text-xs font-medium ${getQualityColor(index, rowIndex)}`}
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
                className={`border-0 px-2.5 py-1 text-xs font-medium ${getQualityColor(index, rowIndex)}`}
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

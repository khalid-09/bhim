"use client";

import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { CompanyFromQuery, WorkLogFromQuery } from "@/db/schema";
import { Button } from "./ui/button";
import { ArrowUpDownIcon } from "lucide-react";
import { cn, getQualityColor } from "@/lib/utils";
import WorkLogActions from "./work-log-actions";

const dateRangeFilter: FilterFn<WorkLogFromQuery> = (row, columnId, value) => {
  const [start, end] = value || [null, null];
  const rowDate = new Date(row.getValue(columnId));

  const rowDateNormalized = new Date(
    rowDate.getFullYear(),
    rowDate.getMonth(),
    rowDate.getDate(),
  );

  if (!start && !end) return true;
  if (start && !end) return rowDateNormalized >= start;
  if (!start && end) return rowDateNormalized <= end;
  return rowDateNormalized >= start && rowDateNormalized <= end;
};

const qualityFilter: FilterFn<WorkLogFromQuery> = (row, columnId, value) => {
  if (!value) return true;
  const quality = row.getValue(columnId) as WorkLogFromQuery["quality"];
  return quality.name.toLowerCase().includes(value.toLowerCase());
};

export const createWorkLogColumns = (
  mode: "single" | "dashboard" = "single",
  companies?: CompanyFromQuery[],
): ColumnDef<WorkLogFromQuery>[] => {
  const baseColumns: ColumnDef<WorkLogFromQuery>[] = [
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-muted-foreground text-xs font-medium tracking-wider uppercase hover:bg-inherit has-[>svg]:px-0"
        >
          Date
          <ArrowUpDownIcon className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("date"));
        return (
          <div className="text-sm font-medium">
            {date.toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </div>
        );
      },
      filterFn: dateRangeFilter,
    },
  ];

  if (mode === "dashboard") {
    baseColumns.push({
      accessorKey: "company",
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
        const company = row.getValue("company") as WorkLogFromQuery["company"];
        return (
          <div className="text-sm font-medium">{company?.name || "N/A"}</div>
        );
      },
      sortingFn: (rowA, rowB) => {
        const companyA =
          (rowA.getValue("company") as WorkLogFromQuery["company"]).name || "";
        const companyB =
          (rowB.getValue("company") as WorkLogFromQuery["company"]).name || "";
        return companyA.localeCompare(companyB);
      },
    });
  }

  // Add remaining columns
  baseColumns.push(
    {
      accessorKey: "machineNo",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-muted-foreground text-xs font-medium tracking-wider uppercase hover:bg-inherit has-[>svg]:px-0"
        >
          Machine
          <ArrowUpDownIcon className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const machineNo = row.getValue("machineNo") as string;
        return (
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-green-500" />
            <span className="text-sm font-medium">#{machineNo}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "quality",
      header: () => (
        <div className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          Quality
        </div>
      ),
      cell: ({ row, table }) => {
        const quality = row.getValue("quality") as WorkLogFromQuery["quality"];
        const rowIndex = row.index;
        const columnIndex = table
          .getAllColumns()
          .findIndex((col) => col.id === "quality");
        return (
          <Badge
            key={quality.id}
            variant="secondary"
            className={cn(
              "border-0 px-2.5 py-1 text-xs font-medium",
              getQualityColor(columnIndex, rowIndex),
            )}
          >
            {quality.name}
          </Badge>
        );
      },
      filterFn: qualityFilter,
      enableSorting: false,
    },

    {
      accessorKey: "taar",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-muted-foreground text-xs font-medium tracking-wider uppercase hover:bg-inherit has-[>svg]:px-0"
        >
          Taar
          <ArrowUpDownIcon className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const taar = parseFloat(row.getValue("taar"));
        return (
          <span className="text-sm font-medium">
            {taar.toLocaleString("en-IN")}
          </span>
        );
      },
    },
    {
      accessorKey: "karigarName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-muted-foreground ml-auto text-xs font-medium tracking-wider uppercase hover:bg-inherit has-[>svg]:px-0"
        >
          Karigar
          <ArrowUpDownIcon className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const karigarName = row.getValue("karigarName") as string;
        return (
          <div className="flex items-center gap-3">
            <div className="flex size-4 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-xs font-medium text-white md:size-6">
              {karigarName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium">{karigarName}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <WorkLogActions
            workLogToEdit={row.original}
            mode={mode}
            companies={companies}
          />
        );
      },
    },
  );

  return baseColumns;
};

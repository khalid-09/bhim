"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { WorkLogFromQuery } from "@/db/schema";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { WorkLogFilters } from "./work-log-table-filters";
import { useState } from "react";

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  companyName?: string;
};

export function WorkLogDataTable<TData extends WorkLogFromQuery, TValue>({
  columns,
  data,
  companyName,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "date", desc: true }, // Default sort by date descending
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const filteredData = table
    .getFilteredRowModel()
    .rows.map((row) => row.original);

  return (
    <div className="w-full">
      <div className="border-border border-b p-6">
        <div className="space-y-4">
          <div className="flex w-full justify-between gap-4 max-sm:flex-col sm:items-start">
            <div>
              <h1 className="text-xl font-semibold">
                {companyName ? `${companyName} Work Log` : "Work Log"}
              </h1>
            </div>
          </div>
          <WorkLogFilters table={table} data={data} />
        </div>
      </div>

      <ScrollArea className="h-fit max-w-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-border border-b hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="bg-muted h-12 px-6">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-border hover:bg-muted/50 cursor-pointer border-b transition-colors last:border-b-0"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-6 py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-gray-500"
                >
                  No work log entries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {table.getPageCount() > 1 && (
        <div className="border-border bg-muted flex items-center justify-between gap-3 border-t px-6 py-4 max-md:flex-col">
          <div className="text-sm">
            Showing{" "}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}
            -
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              filteredData.length,
            )}{" "}
            of {filteredData.length} filtered entries
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 text-sm"
            >
              <ChevronLeftIcon />
              <span className="max-md:hidden">Previous</span>
            </Button>
            <div className="flex items-center gap-1">
              {Array.from(
                { length: Math.min(5, table.getPageCount()) },
                (_, i) => {
                  const pageIndex = i + 1;
                  const isActive =
                    table.getState().pagination.pageIndex + 1 === pageIndex;
                  return (
                    <Button
                      key={pageIndex}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => table.setPageIndex(pageIndex - 1)}
                      className={`h-8 w-8 text-sm ${isActive ? "bg-blue-600 hover:bg-blue-700 dark:text-white" : ""}`}
                    >
                      {pageIndex}
                    </Button>
                  );
                },
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 text-sm"
            >
              <span className="max-md:hidden">Next</span>
              <ChevronRightIcon />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// "use client";
// import {
//   type ColumnDef,
//   type ColumnFiltersState,
//   type SortingState,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import {
//   ChevronLeftIcon,
//   ChevronRightIcon,
//   Calendar,
//   User,
//   Package,
//   Hash,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import type { WorkLogFromQuery } from "@/db/schema";
// import { ScrollArea, ScrollBar } from "./ui/scroll-area";
// import { WorkLogFilters } from "./work-log-table-filters";
// import { useState } from "react";
// import { useIsMobile } from "@/hooks/use-mobile";
// import { getQualityColor } from "@/lib/utils";

// type DataTableProps<TData, TValue> = {
//   columns: ColumnDef<TData, TValue>[];
//   data: TData[];
//   companyName?: string;
// };

// export function WorkLogDataTable<TData extends WorkLogFromQuery, TValue>({
//   columns,
//   data,
//   companyName,
// }: DataTableProps<TData, TValue>) {
//   const [sorting, setSorting] = useState<SortingState>([
//     { id: "date", desc: true },
//   ]);
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
//   const isMobile = useIsMobile();

//   const table = useReactTable({
//     data,
//     columns,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     state: {
//       sorting,
//       columnFilters,
//     },
//   });

//   const filteredData = table
//     .getFilteredRowModel()
//     .rows.map((row) => row.original);

//   const MobileCards = () => (
//     <div className="space-y-3 p-2">
//       {table.getRowModel().rows?.length ? (
//         table.getRowModel().rows.map((row, index) => {
//           const entry = row.original as WorkLogFromQuery;
//           return (
//             <Card key={entry.id} className="gap-2 py-3 shadow-md">
//               <CardHeader className="">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <Calendar className="text-muted-foreground h-4 w-4" />
//                     <span className="text-sm font-medium">
//                       {new Date(entry.date).toLocaleDateString("en-IN", {
//                         day: "2-digit",
//                         month: "short",
//                         year: "numeric",
//                       })}
//                     </span>
//                   </div>
//                   <Badge
//                     variant="secondary"
//                     className={`border-0 px-2.5 py-1 text-xs font-medium ${getQualityColor(index, index)}`}
//                   >
//                     {entry.quality.name}
//                   </Badge>
//                 </div>
//               </CardHeader>
//               <CardContent className="pt-0">
//                 <ul className="flex flex-wrap items-center justify-evenly gap-3 text-sm">
//                   <li className="flex min-w-[100px] items-start gap-2">
//                     <Hash className="text-muted-foreground mt-1 h-4 w-4" />
//                     <div>
//                       <p className="text-muted-foreground text-xs">Machine</p>
//                       <p className="font-medium">#{entry.machineNo}</p>
//                     </div>
//                   </li>
//                   <li className="flex min-w-[100px] items-start gap-2">
//                     <User className="text-muted-foreground m-1 h-4 w-4" />
//                     <div>
//                       <p className="text-muted-foreground text-xs">Karigar</p>
//                       <p className="font-medium">{entry.karigarName}</p>
//                     </div>
//                   </li>
//                   <li className="flex min-w-[100px] items-start gap-2">
//                     <Package className="text-muted-foreground mt-1 h-4 w-4" />
//                     <div>
//                       <p className="text-muted-foreground text-xs">Taar</p>
//                       <p className="font-medium">
//                         {parseFloat(entry.taar).toLocaleString("en-IN")}
//                       </p>
//                     </div>
//                   </li>
//                 </ul>
//               </CardContent>
//             </Card>
//           );
//         })
//       ) : (
//         <Card className="p-8 text-center">
//           <p className="text-muted-foreground">No work log entries found.</p>
//         </Card>
//       )}
//     </div>
//   );

//   return (
//     <div className="w-full">
//       <div className="border-border border-b p-6">
//         <div className="space-y-4">
//           <div className="flex w-full justify-between gap-4 max-sm:flex-col sm:items-start">
//             <div>
//               <h1 className="text-xl font-semibold">
//                 {companyName ? `${companyName} Work Log` : "Work Log"}
//               </h1>
//             </div>
//           </div>
//           <WorkLogFilters table={table} data={data} />
//         </div>
//       </div>

//       {isMobile ? (
//         <MobileCards />
//       ) : (
//         <ScrollArea className="h-fit max-w-full">
//           <Table>
//             <TableHeader>
//               {table.getHeaderGroups().map((headerGroup) => (
//                 <TableRow
//                   key={headerGroup.id}
//                   className="border-border border-b hover:bg-transparent"
//                 >
//                   {headerGroup.headers.map((header) => {
//                     return (
//                       <TableHead key={header.id} className="bg-muted h-12 px-6">
//                         {header.isPlaceholder
//                           ? null
//                           : flexRender(
//                               header.column.columnDef.header,
//                               header.getContext(),
//                             )}
//                       </TableHead>
//                     );
//                   })}
//                 </TableRow>
//               ))}
//             </TableHeader>
//             <TableBody>
//               {table.getRowModel().rows?.length ? (
//                 table.getRowModel().rows.map((row) => (
//                   <TableRow
//                     key={row.id}
//                     data-state={row.getIsSelected() && "selected"}
//                     className="border-border hover:bg-muted/50 cursor-pointer border-b transition-colors last:border-b-0"
//                   >
//                     {row.getVisibleCells().map((cell) => (
//                       <TableCell key={cell.id} className="px-6 py-4">
//                         {flexRender(
//                           cell.column.columnDef.cell,
//                           cell.getContext(),
//                         )}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell
//                     colSpan={columns.length}
//                     className="h-32 text-center text-gray-500"
//                   >
//                     No work log entries found.
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//           <ScrollBar orientation="horizontal" />
//         </ScrollArea>
//       )}

//       {/* Pagination */}
//       {table.getPageCount() > 1 && (
//         <div className="border-border bg-muted flex items-center justify-between gap-3 border-t px-6 py-4 max-md:flex-col">
//           <div className="text-sm">
//             Showing{" "}
//             {table.getState().pagination.pageIndex *
//               table.getState().pagination.pageSize +
//               1}
//             -
//             {Math.min(
//               (table.getState().pagination.pageIndex + 1) *
//                 table.getState().pagination.pageSize,
//               filteredData.length,
//             )}{" "}
//             of {filteredData.length} filtered entries
//           </div>
//           <div className="flex items-center gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => table.previousPage()}
//               disabled={!table.getCanPreviousPage()}
//               className="h-8 text-sm"
//             >
//               <ChevronLeftIcon />
//               <span className="max-md:hidden">Previous</span>
//             </Button>
//             <div className="flex items-center gap-1">
//               {Array.from(
//                 { length: Math.min(5, table.getPageCount()) },
//                 (_, i) => {
//                   const pageIndex = i + 1;
//                   const isActive =
//                     table.getState().pagination.pageIndex + 1 === pageIndex;
//                   return (
//                     <Button
//                       key={pageIndex}
//                       variant={isActive ? "default" : "outline"}
//                       size="sm"
//                       onClick={() => table.setPageIndex(pageIndex - 1)}
//                       className={`h-8 w-8 text-sm ${isActive ? "bg-blue-600 hover:bg-blue-700 dark:text-white" : ""}`}
//                     >
//                       {pageIndex}
//                     </Button>
//                   );
//                 },
//               )}
//             </div>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => table.nextPage()}
//               disabled={!table.getCanNextPage()}
//               className="h-8 text-sm"
//             >
//               <span className="max-md:hidden">Next</span>
//               <ChevronRightIcon />
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

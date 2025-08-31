"use client";

import { useEffect, useState } from "react";
import { CalendarIcon, Filter, X, Check, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import type { Table } from "@tanstack/react-table";
import type { WorkLogFromQuery } from "@/db/schema";
import type { DateRange } from "react-day-picker";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardFooter } from "./ui/card";

interface WorkLogFiltersProps<TData extends WorkLogFromQuery> {
  table: Table<TData>;
  data: TData[];
}

export default function FilterCombobox({
  value,
  onValueChange,
  options,
  placeholder,
  searchPlaceholder,
  className,
}: {
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  searchPlaceholder: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const ComboboxContent = () => (
    <Command>
      <CommandInput placeholder={searchPlaceholder} />
      <CommandList>
        <CommandEmpty>No options found.</CommandEmpty>
        <CommandGroup>
          <CommandItem
            value=""
            onSelect={() => {
              onValueChange("");
              setOpen(false);
            }}
          >
            <Check
              className={cn(
                "mr-2 h-4 w-4",
                !value ? "opacity-100" : "opacity-0",
              )}
            />
            All
          </CommandItem>
          {options.map((option) => (
            <CommandItem
              key={option.value}
              value={option.value}
              onSelect={(currentValue) => {
                onValueChange(currentValue === value ? "" : currentValue);
                setOpen(false);
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  value === option.value ? "opacity-100" : "opacity-0",
                )}
              />
              {option.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );

  if (!isMobile) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("justify-between", className)}
          >
            {value
              ? options.find((option) => option.value === value)?.label
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[200px] p-0">
          <ComboboxContent />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between", className)}
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DrawerTrigger>
      <DrawerHeader className="sr-only">
        <DrawerTitle>Title</DrawerTitle>
      </DrawerHeader>
      <DrawerContent>
        <div className="mt-4 border-t">
          <ComboboxContent />
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export function WorkLogFilters<TData extends WorkLogFromQuery>({
  table,
  data,
}: WorkLogFiltersProps<TData>) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const isMobile = useIsMobile();

  // Extract unique values for filter options
  const uniqueKarigars = Array.from(new Set(data.map((log) => log.karigarName)))
    .sort()
    .map((name) => ({ value: name, label: name }));

  const uniqueQualities = Array.from(
    new Set(data.map((log) => log.quality.name)),
  )
    .sort()
    .map((name) => ({ value: name, label: name }));

  // Get current filter values
  const karigarFilter = table
    .getColumn("karigarName")
    ?.getFilterValue() as string;
  const qualityFilter = table.getColumn("quality")?.getFilterValue() as string;

  // Handle date range filtering
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from || range?.to) {
      table.getColumn("date")?.setFilterValue([range?.from, range?.to]);
    } else {
      table.getColumn("date")?.setFilterValue(undefined);
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    table.resetColumnFilters();
    setDateRange(undefined);
  };

  // Count active filters
  const activeFiltersCount = table.getState().columnFilters.length;

  const FiltersContent = () => (
    <div className="space-y-4 p-4">
      {/* Date Range Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Date Range</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !dateRange && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "MMM dd")} -{" "}
                    {format(dateRange.to, "MMM dd")}
                  </>
                ) : (
                  format(dateRange.from, "MMM dd, yyyy")
                )
              ) : (
                "Pick date range"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <MobileDateRangePicker
              initialRange={dateRange}
              onApply={(range) => {
                setDateRange(range);
                handleDateRangeChange(range);
              }}
              onClear={() => {
                setDateRange(undefined);
                handleDateRangeChange(undefined);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      {/* Karigar Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Karigar</label>
        <FilterCombobox
          value={karigarFilter || ""}
          onValueChange={(value) =>
            table.getColumn("karigarName")?.setFilterValue(value || undefined)
          }
          options={uniqueKarigars}
          placeholder="All Karigars"
          searchPlaceholder="Search karigars..."
          className="w-full"
        />
      </div>

      {/* Quality Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Quality</label>
        <FilterCombobox
          value={qualityFilter || ""}
          onValueChange={(value) =>
            table.getColumn("quality")?.setFilterValue(value || undefined)
          }
          options={uniqueQualities}
          placeholder="All Qualities"
          searchPlaceholder="Search qualities..."
          className="w-full"
        />
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" onClick={clearAllFilters} className="w-full">
          <X className="mr-2 h-4 w-4" />
          Clear All Filters ({activeFiltersCount})
        </Button>
      )}
    </div>
  );

  if (!isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range Filter */}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm font-medium">
              Date:
            </span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[200px] justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "MMM dd")} -{" "}
                        {format(dateRange.to, "MMM dd")}
                      </>
                    ) : (
                      format(dateRange.from, "MMM dd, yyyy")
                    )
                  ) : (
                    "Pick date range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  autoFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={1}
                  disabled={(date) => date > new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Karigar Filter */}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm font-medium">
              Karigar:
            </span>
            <FilterCombobox
              value={karigarFilter || ""}
              onValueChange={(value) =>
                table
                  .getColumn("karigarName")
                  ?.setFilterValue(value || undefined)
              }
              options={uniqueKarigars}
              placeholder="All Karigars"
              searchPlaceholder="Search karigars..."
              className="min-w-[160px]"
            />
          </div>

          {/* Quality Filter */}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm font-medium">
              Quality:
            </span>
            <FilterCombobox
              value={qualityFilter || ""}
              onValueChange={(value) =>
                table.getColumn("quality")?.setFilterValue(value || undefined)
              }
              options={uniqueQualities}
              placeholder="All Qualities"
              searchPlaceholder="Search qualities..."
              className="min-w-[180px]"
            />
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="h-9"
            >
              <X className="mr-1 h-3 w-3" />
              Clear ({activeFiltersCount})
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground text-xs font-medium">
              Active filters:
            </span>

            {(dateRange?.from || dateRange?.to) && (
              <Badge variant="secondary" className="text-xs">
                Date: {dateRange?.from && format(dateRange.from, "MMM dd")}
                {dateRange?.from && dateRange?.to && " - "}
                {dateRange?.to && format(dateRange.to, "MMM dd")}
                <button
                  onClick={() => handleDateRangeChange(undefined)}
                  className="hover:bg-muted-foreground/20 ml-1 rounded-sm"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {karigarFilter && (
              <Badge variant="secondary" className="text-xs">
                Karigar: {karigarFilter}
                <button
                  onClick={() =>
                    table.getColumn("karigarName")?.setFilterValue(undefined)
                  }
                  className="hover:bg-muted-foreground/20 ml-1 rounded-sm"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {qualityFilter && (
              <Badge variant="secondary" className="text-xs">
                Quality: {qualityFilter}
                <button
                  onClick={() =>
                    table.getColumn("quality")?.setFilterValue(undefined)
                  }
                  className="hover:bg-muted-foreground/20 ml-1 rounded-sm"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>
    );
  }

  // Mobile layout
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Drawer open={filtersOpen} onOpenChange={setFiltersOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-primary text-primary-foreground ml-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </DrawerTrigger>
          <DrawerHeader className="sr-only">
            <DrawerTitle>Title</DrawerTitle>
          </DrawerHeader>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <div className="p-4 pb-0">
                <div className="text-center">
                  <h3 className="text-lg font-semibold">Filter Work Log</h3>
                  <p className="text-muted-foreground text-sm">
                    Choose your filtering options
                  </p>
                </div>
              </div>
              <FiltersContent />
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button>Apply Filters</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Active Filters Display for Mobile */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {(dateRange?.from || dateRange?.to) && (
            <Badge variant="secondary" className="text-xs">
              {dateRange?.from && format(dateRange.from, "MMM dd")}
              {dateRange?.from && dateRange?.to && " - "}
              {dateRange?.to && format(dateRange.to, "MMM dd")}
              <button
                onClick={() => handleDateRangeChange(undefined)}
                className="hover:bg-muted-foreground/20 ml-1 rounded-sm"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {karigarFilter && (
            <Badge variant="secondary" className="text-xs">
              {karigarFilter}
              <button
                onClick={() =>
                  table.getColumn("karigarName")?.setFilterValue(undefined)
                }
                className="hover:bg-muted-foreground/20 ml-1 rounded-sm"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {qualityFilter && (
            <Badge variant="secondary" className="text-xs">
              {qualityFilter}
              <button
                onClick={() =>
                  table.getColumn("quality")?.setFilterValue(undefined)
                }
                className="hover:bg-muted-foreground/20 ml-1 rounded-sm"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}

function MobileDateRangePicker({
  initialRange,
  onApply,
  onClear,
}: {
  initialRange: DateRange | undefined;
  onApply: (range: DateRange | undefined) => void;
  onClear: () => void;
}) {
  const [internalRange, setInternalRange] = useState<DateRange | undefined>(
    initialRange,
  );
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setInternalRange(initialRange);
  }, [initialRange]);

  if (!isOpen) return null;

  return (
    <Card className="gap-0 p-0">
      <CardContent className="p-0">
        <Calendar
          autoFocus
          mode="range"
          defaultMonth={internalRange?.from}
          selected={internalRange}
          onSelect={setInternalRange}
          numberOfMonths={1}
          disabled={(date) => date > new Date()}
        />
      </CardContent>
      <CardFooter className="flex gap-2 pb-3">
        <Button
          variant="outline"
          onClick={() => {
            onClear();
            setIsOpen(false);
          }}
          className="flex-1"
        >
          Clear
        </Button>
        <Button
          onClick={() => {
            onApply(internalRange);
            setIsOpen(false);
          }}
          className="flex-1"
        >
          Apply
        </Button>
      </CardFooter>
    </Card>
  );
}

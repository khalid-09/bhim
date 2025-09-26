"use client";

import * as React from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <ToggleGroup
      type="single"
      value={theme}
      onValueChange={(value) => value && setTheme(value)}
      className="bg-muted/50 w-full justify-center gap-1 p-1"
    >
      <ToggleGroupItem
        value="light"
        aria-label="Light mode"
        className={cn(
          "transition-all",
          "data-[state=on]:bg-background h-fit border-r p-0 py-1 data-[state=on]:shadow-sm",
        )}
      >
        <Sun className="size-4" />
      </ToggleGroupItem>

      <ToggleGroupItem
        value="dark"
        aria-label="Dark mode"
        className={cn(
          "transition-all",
          "data-[state=on]:bg-background h-fit border-r p-0 py-1 data-[state=on]:shadow-sm",
        )}
      >
        <Moon className="h-4 w-4" />
      </ToggleGroupItem>

      <ToggleGroupItem
        value="system"
        aria-label="System mode"
        className={cn(
          "transition-all",
          "data-[state=on]:bg-background h-fit p-0 py-1 data-[state=on]:shadow-sm",
        )}
      >
        <Laptop className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default ThemeToggle;

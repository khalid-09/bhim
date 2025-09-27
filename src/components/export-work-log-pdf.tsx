"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import type { WorkLogFromQuery } from "@/db/schema";
import { WorkLogPDFTemplate } from "@/templates/work-log-pdf.template";

interface ExportWorkLogPDFProps {
  workLog: WorkLogFromQuery[];
  companyName: string;
  className?: string;
}

export function ExportWorkLogPDF({
  workLog,
  companyName,
  className,
}: ExportWorkLogPDFProps) {
  const [isPending, startTransition] = useTransition();

  const handleExportPDF = () => {
    startTransition(async () => {
      try {
        // Filter work log for current month
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const currentMonthWorkLog = workLog.filter((entry) => {
          const entryDate = new Date(entry.date);
          return (
            entryDate.getMonth() === currentMonth &&
            entryDate.getFullYear() === currentYear
          );
        });

        if (currentMonthWorkLog.length === 0) {
          alert("No work log entries found for the current month.");
          return;
        }

        // Get unique qualities from the work log
        const qualitiesMap = new Map();
        currentMonthWorkLog.forEach((entry) => {
          if (!qualitiesMap.has(entry.quality.id)) {
            qualitiesMap.set(entry.quality.id, {
              id: entry.quality.id,
              name: entry.quality.name,
              receivableRate: entry.quality.receivableRate,
            });
          }
        });
        const qualities = Array.from(qualitiesMap.values());

        // Format month year
        const monthYear = now.toLocaleDateString("en-IN", {
          month: "long",
          year: "numeric",
        });

        // Generate PDF
        const doc = (
          <WorkLogPDFTemplate
            workLog={currentMonthWorkLog}
            companyName={companyName}
            qualities={qualities}
            monthYear={monthYear}
          />
        );

        const asPdf = pdf(doc);
        const blob = await asPdf.toBlob();

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        // Generate filename
        const sanitizedCompanyName = companyName.replace(/[^a-zA-Z0-9]/g, "_");
        const fileName = `${sanitizedCompanyName}_WorkLog_${monthYear.replace(" ", "_")}.pdf`;
        link.download = fileName;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Failed to generate PDF. Please try again.");
      }
    });
  };

  return (
    <Button
      onClick={handleExportPDF}
      disabled={isPending}
      variant="outline"
      size="sm"
      className={className}
    >
      {isPending ? (
        <Loader2 className="mr-2 size-4 animate-spin" />
      ) : (
        <Download className="mr-2 size-4" />
      )}
      Export PDF
    </Button>
  );
}

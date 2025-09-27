"use client";

import type { WorkLogFromQuery } from "@/db/schema";
import { createWorkLogColumns } from "./work-log-column";
import { WorkLogDataTable } from "./work-log-data-table";
import CompanyWorkLogStats from "./company-work-log-stats";
import { ExportWorkLogPDF } from "./export-work-log-pdf";

type CompanyWorkLog = {
  workLog: WorkLogFromQuery[];
};

const CompanyWorkLog = ({ workLog }: CompanyWorkLog) => {
  const columns = createWorkLogColumns("single");

  const companyName =
    workLog.length > 0
      ? workLog?.[0]?.company?.name || "Unknown Company"
      : "Unknown Company";

  return (
    <>
      <section className="p-4">
        <div className="bg-card mx-auto max-w-7xl border">
          <div className="border-border border-b p-6">
            <div className="space-y-4">
              <div className="flex w-full justify-between gap-4 max-sm:flex-col sm:items-start">
                <div>
                  <h1 className="text-xl font-semibold">
                    {companyName} Work Log
                  </h1>
                </div>
                <ExportWorkLogPDF
                  workLog={workLog}
                  companyName={companyName}
                  className="max-sm:w-full"
                />
              </div>
            </div>
          </div>
          <WorkLogDataTable columns={columns} data={workLog} />
        </div>
      </section>
      <CompanyWorkLogStats workLog={workLog} />
    </>
  );
};

export default CompanyWorkLog;

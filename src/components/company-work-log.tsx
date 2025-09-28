"use client";

import type { CompanyFromQuery, WorkLogFromQuery } from "@/db/schema";
import { createWorkLogColumns } from "./work-log-column";
import { WorkLogDataTable } from "./work-log-data-table";
import CompanyWorkLogStats from "./company-work-log-stats";
import { ExportWorkLogPDF } from "./export-work-log-pdf";
import DeleteMonthlyWorkLogsButton from "./delete-current-month-work-log-button";

type CompanyWorkLog = {
  workLog: WorkLogFromQuery[];
  company: CompanyFromQuery;
};

const CompanyWorkLog = ({ workLog, company }: CompanyWorkLog) => {
  const { name, id } = company;
  const columns = createWorkLogColumns("single");

  return (
    <>
      <section className="p-4">
        <div className="bg-card mx-auto max-w-7xl border">
          <div className="border-border border-b p-6">
            <div className="space-y-4">
              <div className="flex w-full justify-between gap-4 max-sm:flex-col sm:items-start">
                <div>
                  <h1 className="text-xl font-semibold">{name} Work Log</h1>
                </div>
                <div className="flex items-center gap-2">
                  {id && workLog.length >= 1 && (
                    <DeleteMonthlyWorkLogsButton companyId={id} />
                  )}
                  {workLog.length >= 1 && (
                    <ExportWorkLogPDF
                      workLog={workLog}
                      companyName={name}
                      className="flex-1 max-sm:w-full"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <WorkLogDataTable columns={columns} data={workLog} mode="single" />
        </div>
      </section>
      <CompanyWorkLogStats workLog={workLog} />
    </>
  );
};

export default CompanyWorkLog;

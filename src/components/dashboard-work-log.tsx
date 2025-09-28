"use client";

import type { CompanyFromQuery, WorkLogFromQuery } from "@/db/schema";
import { createWorkLogColumns } from "./work-log-column";
import { WorkLogDataTable } from "./work-log-data-table";
import CreateWorkLog from "./create-work-log";

type DashboardWorkLogProps = {
  workLog: WorkLogFromQuery[];
  companies: CompanyFromQuery[];
};

const DashboardWorkLog = ({ workLog, companies }: DashboardWorkLogProps) => {
  const columns = createWorkLogColumns("dashboard", companies);

  return (
    <>
      <section className="border-border mb-4 border-b px-4">
        <div className="mx-auto max-w-7xl py-6">
          <div className="flex justify-between gap-3 max-sm:flex-col sm:items-center">
            <div>
              <h1 className="text-2xl font-semibold">Work Log</h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Manage work log for all companies.
              </p>
            </div>
            <CreateWorkLog companies={companies} mode="dashboard" />
          </div>
        </div>
      </section>
      <section className="px-4">
        <div className="border-border bg-card mx-auto max-w-7xl border shadow-sm">
          <WorkLogDataTable columns={columns} data={workLog} mode="dashboard" />
        </div>
      </section>
    </>
  );
};

export default DashboardWorkLog;

"use client";

import type { WorkLogFromQuery } from "@/db/schema";
import { createWorkLogColumns } from "./work-log-column";
import { WorkLogDataTable } from "./work-log-data-table";
import CompanyWorkLogStats from "./company-work-log-stats";

type CompanyWorkLog = {
  workLog: WorkLogFromQuery[];
};

const CompanyWorkLog = ({ workLog }: CompanyWorkLog) => {
  const columns = createWorkLogColumns("single");

  return (
    <>
      <section className="p-4">
        <div className="bg-card mx-auto max-w-7xl border">
          <WorkLogDataTable
            columns={columns}
            data={workLog}
            companyName="Urban Loomcraft"
          />
        </div>
      </section>
      <CompanyWorkLogStats workLog={workLog} />
    </>
  );
};

export default CompanyWorkLog;

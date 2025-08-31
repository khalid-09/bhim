import type { User } from "better-auth";
import { db } from "..";
import { WorkLogDataTable } from "./work-log-data-table";
import { columns } from "./work-log-column";
import CompanyWorkLogStats from "./company-work-log-stats";

type CompanyWorkLogProps = {
  user: User;
  slug: string;
};

const CompanyWorkLog = async ({ user, slug }: CompanyWorkLogProps) => {
  const workLog = await db.query.workLog.findMany({
    columns: {
      qualityId: false,
      companyId: false,
      createdAt: false,
    },
    where: (workLog, { eq, and }) =>
      and(eq(workLog.userId, user.id), eq(workLog.companyId, slug)),
    with: {
      company: {
        columns: {
          name: true,
          id: true,
        },
      },
      quality: {
        columns: {
          name: true,
          id: true,
          payableRate: true,
          receivableRate: true,
        },
      },
    },
    orderBy: (workLog, { desc }) => [desc(workLog.createdAt)],
  });

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

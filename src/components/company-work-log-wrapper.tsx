import type { User } from "better-auth";
import { db } from "..";
import CompanyWorkLog from "./company-work-log";
import type { CompanyFromQuery } from "@/db/schema";

type CompanyWorkLogProps = {
  user: User;
  slug: string;
  company: CompanyFromQuery;
};

const CompanyWorkLogWrapper = async ({
  user,
  slug,
  company,
}: CompanyWorkLogProps) => {
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
        with: {
          qualities: {
            columns: {
              name: true,
              id: true,
              payableRate: true,
              receivableRate: true,
            },
          },
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

  return <CompanyWorkLog workLog={workLog} company={company} />;
};

export default CompanyWorkLogWrapper;

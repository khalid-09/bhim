import type { User } from "better-auth";
import { db } from "..";

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
        },
      },
    },
    orderBy: (workLog, { desc }) => [desc(workLog.createdAt)],
  });

  return <section>{JSON.stringify(workLog)}</section>;
};

export default CompanyWorkLog;

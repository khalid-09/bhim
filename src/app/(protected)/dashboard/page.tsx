import { auth } from "@/auth";
import DashboardWorkLog from "@/components/dashboard-work-log";
import { db } from "@/index";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session || !session.user) redirect("/");

  const { user } = session;

  const companiesPromise = db.query.company.findMany({
    columns: {
      updatedAt: false,
    },
    where: (company, { eq }) => eq(company.userId, session.user.id),
    with: {
      qualities: {
        columns: {
          id: true,
          companyId: true,
          payableRate: true,
          receivableRate: true,
          name: true,
        },
      },
    },
    orderBy: (company, { desc }) => [desc(company.createdAt)],
  });

  const workLogPromise = db.query.workLog.findMany({
    columns: {
      qualityId: false,
      companyId: false,
      createdAt: false,
    },
    where: (workLog, { eq }) => eq(workLog.userId, user.id),
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

  const [companies, workLog] = await Promise.all([
    companiesPromise,
    workLogPromise,
  ]);

  return <DashboardWorkLog workLog={workLog} companies={companies} />;
};

export default Page;

import { auth } from "@/auth";

import { db } from "@/index";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import CompanyHeader from "@/components/company-header";
import CreateWorkLog from "@/components/create-work-log";

type IndividualCompanyProps = {
  params: Promise<{ slug: string }>;
};

const IndividualCompanyPage = async ({ params }: IndividualCompanyProps) => {
  const { slug } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session || !session.user) redirect("/");

  const company = await db.query.company.findFirst({
    columns: {
      userId: true,
      name: true,
      id: true,
      createdAt: true,
    },
    where: (company, { eq, and }) =>
      and(eq(company.userId, session.user.id), eq(company.id, slug)),
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
  });

  if (!company) return <div>No company Found.</div>;

  return (
    <>
      <CompanyHeader company={company} />
      <section className="border-b border-gray-200 bg-white px-4">
        <div className="mx-auto max-w-7xl py-4">
          <div className="flex justify-between gap-3 max-sm:flex-col sm:items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Work log</h3>
              <p className="mt-1 text-sm text-gray-600">
                Add work done in this company.
              </p>
            </div>
            <CreateWorkLog company={company} mode="single" />
          </div>
        </div>
      </section>
    </>
  );
};

export default IndividualCompanyPage;

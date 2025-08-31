import { auth } from "@/auth";
import { columns } from "@/components/companies-columns";
import { CompaniesDataTable } from "@/components/companies-data-table";
import CompanyStats from "@/components/company-stats";
import CreateCompany from "@/components/create-company";
import { db } from "@/index";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.session || !session.user) redirect("/");

  const companies = await db.query.company.findMany({
    columns: {
      userId: true,
      name: true,
      id: true,
      createdAt: true,
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

  return (
    <>
      <section className="border-border bg-card border-b px-4">
        <div className="mx-auto max-w-7xl py-6">
          <div className="flex justify-between gap-3 max-sm:flex-col sm:items-center">
            <div>
              <h1 className="text-2xl font-semibold">Companies</h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Manage your companies and their qualities
              </p>
            </div>
            <CreateCompany />
          </div>
        </div>
      </section>
      <section className="px-4">
        <div className="mx-auto mb-10 max-w-7xl space-y-4">
          <CompanyStats companies={companies} />
          <div className="border-border bg-card border shadow-sm">
            <CompaniesDataTable columns={columns} data={companies} />
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;

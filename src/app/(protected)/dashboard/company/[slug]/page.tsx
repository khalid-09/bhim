import { auth } from "@/auth";

import { db } from "@/index";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import CompanyHeader from "@/components/company-header";
import CreateWorkLog from "@/components/create-work-log";
import { Suspense } from "react";
import CompanyWorkLogWrapper from "@/components/company-work-log-wrapper";
import { Loader2 } from "lucide-react";

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
      <section className="border-border bg-card border-b px-4">
        <div className="mx-auto max-w-7xl py-4">
          <div className="flex justify-between gap-3 max-sm:flex-col sm:items-center">
            <div>
              <h3 className="text-xl font-semibold">Work log</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Add work done in this company.
              </p>
            </div>
            <CreateWorkLog company={company} mode="single" />
          </div>
        </div>
      </section>
      <Suspense
        fallback={
          <div className="mx-auto flex w-full max-w-7xl items-center justify-center">
            <Loader2 className="mt-4" />
          </div>
        }
      >
        <CompanyWorkLogWrapper
          user={session.user}
          slug={slug}
          company={company}
        />
      </Suspense>
    </>
  );
};

export default IndividualCompanyPage;

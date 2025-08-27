import { auth } from "@/auth";

import { db } from "@/index";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import CompanyHeader from "@/components/company-header";

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
    </>
  );
};

export default IndividualCompanyPage;

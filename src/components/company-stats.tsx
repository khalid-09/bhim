import type { CompanyFromQuery } from "@/db/schema";
import { Building2, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CompanyStatsProps = {
  companies: CompanyFromQuery[];
};

const CompanyStats = ({ companies }: CompanyStatsProps) => {
  const totalCompanies = companies.length;
  const allQualities = companies.flatMap((company) => company.qualities);
  const uniqueQualities = new Set(allQualities.map((quality) => quality.name));
  const totalUniqueQualities = uniqueQualities.size;

  return (
    <>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <Card className="border-border/50 from-card via-card to-card/80 gap-0 bg-gradient-to-br p-2 shadow-sm transition-all duration-200 sm:p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-0 max-sm:flex-col-reverse">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Total Companies
            </CardTitle>
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-md">
              <Building2 className="text-primary h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <div className="text-foreground flex items-center text-xl font-bold max-sm:justify-center md:text-2xl">
              {totalCompanies}
            </div>
            <p className="text-muted-foreground mt-1 text-xs max-sm:text-center">
              Active companies in your account
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 from-card via-card to-card/80 gap-0 bg-gradient-to-br p-2 shadow-sm transition-all duration-200 sm:p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-0 max-sm:flex-col-reverse">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Unique Qualities
            </CardTitle>
            <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-md">
              <Package className="text-chart-2 h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <div className="text-foreground flex items-center text-xl font-bold max-sm:justify-center md:text-2xl">
              {totalUniqueQualities}
            </div>
            <p className="text-muted-foreground mt-1 text-xs max-sm:text-center">
              Different quality types across all companies
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CompanyStats;

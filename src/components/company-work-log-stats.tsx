import { TrendingUp, TrendingDown, IndianRupee } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WorkLogFromQuery } from "@/db/schema";
import { formatPrice } from "@/lib/utils";

type WorkLogStat = {
  workLog: WorkLogFromQuery[];
};

const CompanyWorkLogStats = ({ workLog }: WorkLogStat) => {
  const qualityTotals = workLog.reduce(
    (acc, entry) => {
      const qualityId = entry.quality.id;
      if (!acc[qualityId]) {
        acc[qualityId] = {
          count: 0,
          payableRate: parseFloat(entry.quality.payableRate),
          receivableRate: parseFloat(entry.quality.receivableRate),
        };
      }
      acc[qualityId].count += 1;
      return acc;
    },
    {} as Record<
      string,
      { count: number; payableRate: number; receivableRate: number }
    >,
  );

  const totalPayable = Object.values(qualityTotals).reduce((sum, quality) => {
    return sum + quality.count * quality.payableRate;
  }, 0);

  const totalReceivable = Object.values(qualityTotals).reduce(
    (sum, quality) => {
      return sum + quality.count * quality.receivableRate;
    },
    0,
  );

  const totalProfit = totalReceivable - totalPayable;

  return (
    <section className="mb-4 px-4">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 md:grid-cols-3">
        <Card className="border-border/50 from-card via-card to-card/80 gap-0 bg-gradient-to-br p-2 shadow-sm transition-all duration-200 sm:p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-0 max-sm:flex-col-reverse">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Total Receivable
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-100">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <div className="text-foreground flex items-center text-xl font-bold max-sm:justify-center md:text-2xl">
              {formatPrice(totalReceivable)}
            </div>
            <p className="text-muted-foreground mt-1 text-xs max-sm:text-center">
              Amount receivable from company
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 from-card via-card to-card/80 gap-0 bg-gradient-to-br p-2 shadow-sm transition-all duration-200 sm:p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-0 max-sm:flex-col-reverse">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Total Payable
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-red-100">
              <TrendingDown className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <div className="text-foreground flex items-center text-xl font-bold max-sm:justify-center md:text-2xl">
              {formatPrice(totalPayable)}
            </div>
            <p className="text-muted-foreground mt-1 text-xs max-sm:text-center">
              Amount payable to karigars
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 from-card via-card to-card/80 gap-0 bg-gradient-to-br p-2 shadow-sm transition-all duration-200 max-md:col-span-2 sm:p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-0 max-sm:flex-col-reverse">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Total Profit
            </CardTitle>
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-md ${
                totalProfit >= 0 ? "bg-blue-100" : "bg-orange-100"
              }`}
            >
              <IndianRupee
                className={`h-4 w-4 ${
                  totalProfit >= 0 ? "text-blue-600" : "text-orange-600"
                }`}
              />
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <div
              className={`flex items-center text-xl font-bold max-sm:justify-center md:text-2xl ${
                totalProfit >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatPrice(totalProfit)}
            </div>
            <p className="text-muted-foreground mt-1 text-xs max-sm:text-center">
              {totalProfit >= 0 ? "Profit margin" : "Loss margin"}
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CompanyWorkLogStats;

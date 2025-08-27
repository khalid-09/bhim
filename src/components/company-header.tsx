import CompanyActions from "@/components/company-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { CompanyFromQuery } from "@/db/schema";
import { convertDate, formatPrice } from "@/lib/utils";
import { Package } from "lucide-react";

type CompanyHeaderProps = {
  company: CompanyFromQuery;
};

const CompanyHeader = ({ company }: CompanyHeaderProps) => {
  return (
    <section className="space-y-4 border-b px-4 py-6">
      <header className="mx-auto flex w-full max-w-7xl items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold md:text-3xl lg:text-4xl">
            {company.name}
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Created on : {convertDate(company.createdAt, "dd MMM yyyy")}
          </p>
        </div>
        <CompanyActions company={company} />
      </header>
      <Carousel className="mx-auto max-w-7xl space-y-2">
        <div className="flex w-full items-center justify-between">
          <h3 className="text-lg font-semibold md:text-xl">
            Company Qualities :
          </h3>
          <div className="flex items-center gap-2">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </div>
        <CarouselContent className="-ml-4">
          {company.qualities.map((quality, index) => (
            <CarouselItem
              key={index}
              className="pl-4 md:basis-1/2 lg:basis-1/3"
            >
              <Card className="gap-4 py-4">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4">
                  <CardTitle>{quality.name}</CardTitle>
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-md">
                    <Package className="text-chart-2 h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent className="px-4">
                  <span className="block font-medium">
                    Payable Rate : {formatPrice(Number(quality.payableRate))}
                  </span>
                  <span className="block font-medium">
                    Receivable Rate :{" "}
                    {formatPrice(Number(quality.receivableRate))}
                  </span>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default CompanyHeader;

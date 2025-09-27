import { Document, Font, Page, Text, View } from "@react-pdf/renderer";
import type { WorkLogFromQuery } from "@/db/schema";

Font.register({
  family: "GeistMono",
  fonts: [
    {
      src: "/font/GeistMono-Regular.ttf",
      fontWeight: 400,
    },
    {
      src: "/font/GeistMono-Medium.ttf",
      fontWeight: 500,
    },
    {
      src: "/font/GeistMono-SemiBold.ttf",
      fontWeight: 600,
    },
  ],
});

interface WorkLogPDFProps {
  workLog: WorkLogFromQuery[];
  companyName: string;
  qualities: Array<{
    id: string;
    name: string;
    receivableRate: string;
  }>;
  monthYear: string;
}

const formatAmount = (amount: number) => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

export function WorkLogPDFTemplate({
  workLog,
  companyName,
  qualities,
  monthYear,
}: WorkLogPDFProps) {
  // Sort work log by date (ascending order - 1st to 30th)
  const sortedWorkLog = [...workLog].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  // Calculate totals
  const qualityBreakdown = qualities
    .map((quality) => {
      const qualityEntries = sortedWorkLog.filter(
        (entry) => entry.quality.id === quality.id,
      );
      const entryCount = qualityEntries.length; // Count of entries
      const amount = entryCount * parseFloat(quality.receivableRate);

      return {
        ...quality,
        entryCount,
        amount,
      };
    })
    .filter((q) => q.entryCount > 0);

  // Total amount is sum of all quality amounts
  const totalAmount = qualityBreakdown.reduce(
    (sum, quality) => sum + quality.amount,
    0,
  );

  const totalTaar = sortedWorkLog.reduce((sum, entry) => {
    const taar = entry.taar || 0;
    return sum + taar;
  }, 0);

  // Split work log into chunks for multiple pages
  const itemsPerPage = 25;
  const pages = [];
  for (let i = 0; i < sortedWorkLog.length; i += itemsPerPage) {
    pages.push(sortedWorkLog.slice(i, i + itemsPerPage));
  }

  return (
    <Document>
      {pages.map((pageEntries, pageIndex) => (
        <Page
          key={pageIndex}
          size="A4"
          style={{
            padding: 20,
            backgroundColor: "#fff",
            fontFamily: "GeistMono",
            color: "#000",
            fontSize: 10,
          }}
        >
          {/* Header - only on first page */}
          {pageIndex === 0 && (
            <View
              style={{
                marginBottom: 30,
                borderBottomWidth: 2,
                borderBottomColor: "#e5e5e5",
                paddingBottom: 20,
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  color: "#0f0f0f",
                  marginBottom: 8,
                }}
              >
                {companyName}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  color: "#737373",
                  marginBottom: 15,
                }}
              >
                Work Log - {monthYear}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {qualities.map((quality) => (
                  <View
                    key={quality.id}
                    style={{
                      backgroundColor: "#f5f5f5",
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 6,
                      marginRight: 8,
                      marginBottom: 4,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#000000",
                      }}
                    >
                      {quality.name} -{" "}
                      {formatAmount(parseFloat(quality.receivableRate))}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Table */}
          <View style={{ marginTop: 20 }}>
            {/* Table Header */}
            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 0.5,
                borderBottomColor: "#000",
                paddingBottom: 5,
                marginBottom: 5,
              }}
            >
              <Text style={{ flex: 0.5 }} />
              <Text style={{ flex: 1, fontSize: 9, fontWeight: 500 }}>
                DATE
              </Text>
              <Text style={{ flex: 1, fontSize: 9, fontWeight: 500 }}>
                MACHINE
              </Text>
              <Text style={{ flex: 1.5, fontSize: 9, fontWeight: 500 }}>
                QUALITY
              </Text>
              <Text style={{ flex: 1, fontSize: 9, fontWeight: 500 }}>
                TAAR
              </Text>
              <Text style={{ flex: 1.5, fontSize: 9, fontWeight: 500 }}>
                KARIGAR
              </Text>
              <Text
                style={{
                  flex: 1,
                  fontSize: 9,
                  fontWeight: 500,
                  textAlign: "right",
                }}
              >
                RATE
              </Text>
            </View>
            {/* Table Rows */}
            {pageEntries.map((entry, index) => {
              const taar = entry.taar || 0;
              const rate = parseFloat(entry.quality.receivableRate);
              // Calculate serial number across all pages
              const serialNumber = pageIndex * itemsPerPage + index + 1;

              return (
                <View
                  key={`${entry.id}-${index}`}
                  style={{
                    flexDirection: "row",
                    paddingVertical: 5,
                    alignItems: "flex-start",
                  }}
                >
                  <Text style={{ flex: 0.5, fontSize: 9 }}>{serialNumber}</Text>
                  <Text style={{ flex: 1, fontSize: 9 }}>
                    {new Date(entry.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </Text>
                  <Text style={{ flex: 1, fontSize: 9 }}>
                    #{entry.machineNo}
                  </Text>
                  <Text style={{ flex: 1.5, fontSize: 9, fontWeight: 500 }}>
                    {entry.quality.name}
                  </Text>
                  <Text style={{ flex: 1, fontSize: 9 }}>
                    {taar === 0 ? "-" : taar.toLocaleString("en-IN")}
                  </Text>
                  <Text style={{ flex: 1.5, fontSize: 9 }}>
                    {entry.karigarName}
                  </Text>
                  <Text style={{ flex: 1, fontSize: 9, textAlign: "right" }}>
                    {formatAmount(rate)}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Summary - only on last page */}
          {pageIndex === pages.length - 1 && (
            <View
              style={{
                marginTop: 30,
                paddingTop: 20,
                borderTopWidth: 2,
                borderTopColor: "#e5e5e5",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  marginBottom: 15,
                  color: "#0f0f0f",
                }}
              >
                Summary
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between" as const,
                  gap: 20,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: 15,
                    borderRadius: 8,
                    flex: 1,
                    alignItems: "center" as const,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 9,
                      color: "#737373",
                      marginBottom: 4,
                      textTransform: "uppercase" as const,
                      letterSpacing: 0.5,
                    }}
                  >
                    Total Entries
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#0f0f0f",
                    }}
                  >
                    {sortedWorkLog.length}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: 15,
                    borderRadius: 8,
                    flex: 1,
                    alignItems: "center" as const,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 9,
                      color: "#737373",
                      marginBottom: 4,
                      textTransform: "uppercase" as const,
                      letterSpacing: 0.5,
                    }}
                  >
                    Total Taar
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#0f0f0f",
                    }}
                  >
                    {totalTaar.toLocaleString("en-IN")}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: 15,
                    borderRadius: 8,
                    flex: 1,
                    alignItems: "center" as const,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 9,
                      color: "#737373",
                      marginBottom: 4,
                      textTransform: "uppercase" as const,
                      letterSpacing: 0.5,
                    }}
                  >
                    Total Amount
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#0f0f0f",
                    }}
                  >
                    {formatAmount(totalAmount)}
                  </Text>
                </View>
              </View>

              {qualityBreakdown.length > 0 && (
                <View style={{ marginTop: 20 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      marginBottom: 10,
                      color: "#0f0f0f",
                    }}
                  >
                    Quality Breakdown
                  </Text>
                  {qualityBreakdown.map((quality) => (
                    <View
                      key={quality.id}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingVertical: 4,
                        borderBottomWidth: 0.5,
                        borderBottomColor: "#f0f0f0",
                      }}
                    >
                      <Text style={{ fontSize: 9, color: "#0f0f0f" }}>
                        {quality.name}
                      </Text>
                      <Text style={{ fontSize: 9, color: "#0f0f0f" }}>
                        {quality.entryCount} entries
                      </Text>
                      <Text
                        style={{
                          fontSize: 9,
                          fontWeight: 500,
                          color: "#0f0f0f",
                        }}
                      >
                        {formatAmount(quality.amount)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Footer */}
          <View
            style={{
              position: "absolute" as const,
              bottom: 30,
              left: 40,
              right: 40,
              textAlign: "center" as const,
              fontSize: 8,
              color: "#737373",
              borderTopWidth: 1,
              borderTopColor: "#f0f0f0",
              paddingTop: 10,
            }}
          >
            <Text>
              Generated on {new Date().toLocaleDateString("en-IN")} • Page{" "}
              {pageIndex + 1} of {pages.length}
            </Text>
          </View>
        </Page>
      ))}
    </Document>
  );
}

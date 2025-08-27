import { db } from "./src";
import { company, quality } from "@/db/schema";

const companiesSeed = [
  {
    name: "Apex Textiles Pvt Ltd",
    qualities: [
      {
        name: "Cotton 40s Plain",
        payableRate: "110.00",
        receivableRate: "125.00",
      },
      {
        name: "Cotton 60s Twill",
        payableRate: "128.50",
        receivableRate: "144.00",
      },
      {
        name: "PolyCotton 65/35",
        payableRate: "102.75",
        receivableRate: "118.00",
      },
    ],
  },
  {
    name: "BlueLoom Fabrics",
    qualities: [
      { name: "Rayon 30D", payableRate: "96.00", receivableRate: "112.00" },
      {
        name: "Viscose Plain 44",
        payableRate: "104.25",
        receivableRate: "119.50",
      },
      { name: "Satin 4H", payableRate: "135.00", receivableRate: "152.00" },
    ],
  },
  {
    name: "Summit Weaves",
    qualities: [
      { name: "Denim 10 oz", payableRate: "148.00", receivableRate: "168.00" },
      { name: "Denim 12 oz", payableRate: "162.00", receivableRate: "184.00" },
      { name: "Chambray 40s", payableRate: "118.00", receivableRate: "134.00" },
    ],
  },
  {
    name: "Emerald Mills",
    qualities: [
      {
        name: "Linen Blend 55/45",
        payableRate: "170.00",
        receivableRate: "192.00",
      },
      { name: "Poplin 60x60", payableRate: "125.00", receivableRate: "142.00" },
      {
        name: "Percale 200TC",
        payableRate: "155.00",
        receivableRate: "175.00",
      },
    ],
  },
  {
    name: "Orion Knitworks",
    qualities: [
      {
        name: "Single Jersey 160 GSM",
        payableRate: "92.00",
        receivableRate: "108.00",
      },
      {
        name: "Interlock 220 GSM",
        payableRate: "128.00",
        receivableRate: "146.00",
      },
      {
        name: "Pique 200 GSM",
        payableRate: "120.00",
        receivableRate: "138.00",
      },
    ],
  },
  {
    name: "SilverThread Exports",
    qualities: [
      {
        name: "Twill 2/1 100% Cotton",
        payableRate: "130.00",
        receivableRate: "148.00",
      },
      { name: "Sateen 5H", payableRate: "140.00", receivableRate: "160.00" },
      { name: "Oxford 40x2", payableRate: "134.00", receivableRate: "152.00" },
    ],
  },
  {
    name: "Galaxy Looms",
    qualities: [
      {
        name: "Polyester Crepe",
        payableRate: "95.00",
        receivableRate: "112.00",
      },
      {
        name: "Georgette 60 GSM",
        payableRate: "102.00",
        receivableRate: "119.00",
      },
      { name: "Chiffon Plain", payableRate: "98.00", receivableRate: "114.00" },
    ],
  },
  {
    name: "Heritage Cottons",
    qualities: [
      {
        name: "Khadi Handloom",
        payableRate: "88.00",
        receivableRate: "104.00",
      },
      { name: "Muslin 100s", payableRate: "145.00", receivableRate: "165.00" },
      {
        name: "Cambric 60x60",
        payableRate: "118.00",
        receivableRate: "135.00",
      },
    ],
  },
  {
    name: "Urban Loomcraft",
    qualities: [
      {
        name: "Poly Viscose Blend",
        payableRate: "110.00",
        receivableRate: "126.00",
      },
      {
        name: "Stretch Twill",
        payableRate: "132.00",
        receivableRate: "149.00",
      },
      {
        name: "Corduroy 8 Wale",
        payableRate: "160.00",
        receivableRate: "178.00",
      },
    ],
  },
  {
    name: "Phoenix Knits",
    qualities: [
      {
        name: "Rib Knit 180 GSM",
        payableRate: "100.00",
        receivableRate: "116.00",
      },
      {
        name: "Fleece 250 GSM",
        payableRate: "145.00",
        receivableRate: "162.00",
      },
      { name: "French Terry", payableRate: "122.00", receivableRate: "138.00" },
    ],
  },
  {
    name: "Zenith Yarns",
    qualities: [
      {
        name: "Cotton Yarn 30s",
        payableRate: "180.00",
        receivableRate: "198.00",
      },
      {
        name: "Cotton Yarn 40s",
        payableRate: "200.00",
        receivableRate: "218.00",
      },
      {
        name: "Viscose Yarn 30s",
        payableRate: "160.00",
        receivableRate: "178.00",
      },
    ],
  },
  {
    name: "Majestic Textiles",
    qualities: [
      { name: "Taffeta 190T", payableRate: "92.00", receivableRate: "108.00" },
      { name: "Taffeta 210T", payableRate: "104.00", receivableRate: "120.00" },
      {
        name: "Microfiber Plain",
        payableRate: "115.00",
        receivableRate: "132.00",
      },
    ],
  },
  {
    name: "Crown Loom Industries",
    qualities: [
      { name: "Canvas 8 oz", payableRate: "135.00", receivableRate: "152.00" },
      { name: "Duck 10 oz", payableRate: "145.00", receivableRate: "163.00" },
      { name: "Drill 3/1", payableRate: "125.00", receivableRate: "142.00" },
    ],
  },
  {
    name: "Nova Denim Mills",
    qualities: [
      {
        name: "Stretch Denim 11 oz",
        payableRate: "155.00",
        receivableRate: "175.00",
      },
      {
        name: "Rigid Denim 13 oz",
        payableRate: "168.00",
        receivableRate: "188.00",
      },
      {
        name: "Black Denim 12 oz",
        payableRate: "160.00",
        receivableRate: "180.00",
      },
    ],
  },
  {
    name: "Regal Fabrics",
    qualities: [
      { name: "Velvet Plain", payableRate: "200.00", receivableRate: "225.00" },
      {
        name: "Velvet Embossed",
        payableRate: "215.00",
        receivableRate: "240.00",
      },
      { name: "Suede Finish", payableRate: "185.00", receivableRate: "205.00" },
    ],
  },
];

const seedCompanies = async () => {
  const userId = "VXVWQG2yrrGLIs0VE0ukdRWXPqxWHdoZ";

  for (const c of companiesSeed) {
    const [inserted] = await db
      .insert(company)
      .values({
        name: c.name,
        userId,
      })
      .returning({ id: company.id });

    await db.insert(quality).values(
      c.qualities.map((q) => ({
        name: q.name,
        payableRate: q.payableRate,
        receivableRate: q.receivableRate,
        companyId: inserted?.id || "",
      })),
    );
  }
};

(async () => {
  try {
    await seedCompanies();
    console.log("✅ Companies seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding companies:", err);
    process.exit(1);
  }
})();

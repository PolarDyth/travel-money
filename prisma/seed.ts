import { prisma } from "@/lib/prisma";
import { Prisma } from "../generated/prisma";

const currencies: Prisma.CurrencyCreateManyInput[] = [
  {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    denominations: [500, 200, 100, 50, 20, 10, 5],
  },
  {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    denominations: [100, 50, 20, 10, 5, 1],
  },
  {
    code: "JPY",
    name: "Japanese Yen",
    symbol: "¥",
    denominations: [10000, 5000, 1000],
  },
  {
    code: "AUD",
    name: "Australian Dollar",
    symbol: "A$",
    denominations: [100, 50, 20, 10, 5],
  },
  {
    code: "CAD",
    name: "Canadian Dollar",
    symbol: "C$",
    denominations: [100, 50, 20, 10, 5],
  },
  {
    code: "CHF",
    name: "Swiss Franc",
    symbol: "Fr.",
    denominations: [1000, 200, 100, 50, 20, 10],
  },
];

async function main() {
  for (const cur of currencies) {
    await prisma.currency.upsert({
      where: { code: cur.code },
      create: cur,
      update: cur,
    })
  }
  console.log(`Created ${currencies.length} currencies`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
  console.log("Disconnected from database");
})
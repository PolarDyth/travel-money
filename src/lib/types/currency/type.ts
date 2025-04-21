import { Prisma } from "../../../../generated/prisma";

export type Currencies = Prisma.CurrencyGetPayload<{
  include: {
    rates: {
      where: { baseCode: "GBP" };
      select: {
        rate: true;
        buyRate: true;
        sellRate: true;
        fetchedAt: true;
      };
    };
  };
}>;
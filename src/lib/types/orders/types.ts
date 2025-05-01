import { Prisma } from "../../../../generated/prisma";

export type Order = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        currency: true;
        requestedDenoms: true;
      }
    },
    customer: true;
    operator: true;
  };
}>;
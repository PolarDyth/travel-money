import { Prisma } from "../../../../generated/prisma";

export type Order = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        currency: true;
        requestedDenoms: true;
      }
    },
    customer: {
      select: {
        firstNameEnc: true,
        lastNameEnc: true,
        emailEnc: true,
        phoneEnc: true,
        primaryIdNumberEnc: true,
        id: true,
      }
    },
    operator: true;
  };
}>;

export interface CustomerOrder {
  totalOrders: number;
  totalSpent: number;
}
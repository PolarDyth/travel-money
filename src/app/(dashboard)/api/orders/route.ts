import { decryptDeterministic, decryptFromString } from "@/lib/encryption";
import { prisma } from "@/lib/prisma";

export async function GET() {

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); // Start of tomorrow

  try {
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          {collectedAt: null},
          {
            collectedAt: {
              gte: today,
              lt: tomorrow,
            },
          }
        ]
      },
      include: {
        items: {
          include: {
            requestedDenoms: true,
            currency: true,
          },
        },
        customer: true,
        operator: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!orders) {
      return new Response(
        JSON.stringify({
          error: "No orders found",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const decryptedOrders = orders.map((order) => ({
      ...order,
      customer: {
        ...order.customer,
        firstNameEnc: decryptDeterministic(order.customer.firstNameEnc) ?? "",
        lastNameEnc: decryptDeterministic(order.customer.lastNameEnc) ?? "",
      }
    }));

    return new Response(JSON.stringify(decryptedOrders), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

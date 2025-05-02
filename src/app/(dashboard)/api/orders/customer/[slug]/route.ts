import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    return new Response("Slug is required", { status: 400 });
  }

  let id: number;
  try {
    id = Number(slug);
    if (isNaN(id)) {
      return new Response("Invalid slug", { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return new Response("Invalid slug", { status: 400 });
  }

  let totalOrders: number;

  try {
    totalOrders = await prisma.order.count({
      where: { customerId: id },
    });
  } catch (error) {
    console.error(error);
    return new Response("Error fetching total orders", { status: 500 });
  }
  let totalSpent: number;
  try {
    totalSpent = await prisma.order
      .aggregate({
        where: { customerId: id },
        _sum: { totalSterling: true },
      })
      .then((result) => Number(result._sum.totalSterling) ?? 0);
  } catch (error) {
    console.error(error);
    return new Response("Error fetching total spend", { status: 500 });
  }

  return new Response(JSON.stringify({ totalOrders, totalSpent }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

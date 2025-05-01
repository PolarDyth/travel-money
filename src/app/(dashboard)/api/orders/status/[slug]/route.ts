import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { OrderStatus } from "../../../../../../../generated/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
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

  try {
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return new Response("Status is required", { status: 400 });
    }

    if (!(status in OrderStatus)) {
      return new Response("Invalid status", { status: 400 });
    }

    await prisma.order.update({
      where: { id },
      data: { status },
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }

}
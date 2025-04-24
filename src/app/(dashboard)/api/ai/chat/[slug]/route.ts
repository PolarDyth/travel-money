import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!slug) {
    return new Response(
      JSON.stringify({
        error: "Missing slug",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const nextAuthSession = await auth();
  const user = nextAuthSession?.user;

  if (!user) {
    return new Response(
      JSON.stringify({
        error: "Unauthorized",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const chat = await prisma.chatSession.findUnique({
    where: {
      id: slug,
      userId: user?.id,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!chat) {
    return new Response(
      JSON.stringify({
        error: "Chat session not found",
      }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  return new Response(JSON.stringify(chat), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function DELETE({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!slug) {
    return new Response(
      JSON.stringify({
        error: "Missing slug",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const nextAuthSession = await auth();
  const user = nextAuthSession?.user;

  if (!user) {
    return new Response(
      JSON.stringify({
        error: "Unauthorized",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const chat = await prisma.chatSession.delete({
    where: {
      id: slug,
      userId: user?.id,
    },
  });

  if (!chat) {
    return new Response(
      JSON.stringify({
        error: "Chat session not found",
      }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  return new Response(JSON.stringify(chat), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
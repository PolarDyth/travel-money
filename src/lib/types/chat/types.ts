import { Prisma } from "../../../../generated/prisma";

export type ChatMessageType = Prisma.ChatMessageGetPayload<{
  select: {
    content: true;
    createdAt: true;
    role: true;
  };
}>;

export type ChatSessionType = Prisma.ChatSessionGetPayload<{
  select: {
    id: true;
    title: true;
    messages: true;
    createdAt: true;
  };
  include: {
    messages: true;
    orderBy: {
      createdAt: "asc";
    };
  };
}>;
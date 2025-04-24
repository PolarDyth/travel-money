import useSWR from "swr";
import { ChatSessionType } from "@/lib/types/chat/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useChat(slug: string | null) {

  const { data, isLoading, error, mutate } = useSWR<ChatSessionType>(slug ? `/api/ai/chat/${slug}` : null, fetcher);

  return { chat: data, isLoading, error, mutate };
}

export function useChats() {
  const { data, isLoading, error, mutate } = useSWR<ChatSessionType[]>("/api/ai/chat", fetcher);
  return { chats: data, isLoading, error, mutate };
}
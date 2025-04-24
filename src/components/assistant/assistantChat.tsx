"use client";

import type React from "react";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useChat } from "@/routes/chat";
import { ChatHistorySidebar } from "./chatHistoryBar";
import { ChatMessageType } from "@/lib/types/chat/types";
import { ChatMessage } from "./chatMessage";
import { ChatSkeleton } from "../ui/skeletons/assistant/chatSkeleton";

export function AssistantChat() {
  const params = useSearchParams();
  const router = useRouter();

  const chatId = params?.get("chatId") as string | null;

  console.log("Chat ID:", chatId); // Debugging line to check chat ID

  const { chat, isLoading, error } = useChat(chatId);

  const [activeChatId, setActiveChatId] = useState<string | null>(() => {
    if (chatId) {
      return chatId;
    } else {
      return null;
    }
  });
  const [messages, setMessages] = useState<ChatMessageType[]>(() => {
    if (chat) {
      return chat.messages;
    } else {
      return [];
    }
  });
  const [title, setTitle] = useState<string>(() => {
    if (chat && chat.title) {
      return chat.title;
    } else {
      return "New Conversation";
    }
  });
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load chat history on mount



  useEffect(() => {
    if (!isLoading && chat) {
      setMessages(chat.messages || []);
      setTitle(chat.title || "New Conversation");
      setActiveChatId(chatId);
    }
    // Optionally handle error state here if needed
  }, [chat, isLoading, chatId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on load and when active chat changes
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeChatId]);

  const createNewChat = useCallback(() => {
    const welcomeMessage: ChatMessageType = {
      role: "ASSISTANT",
      content:
        "Hello! I'm your Travel Money assistant. How can I help you today?",
      createdAt: new Date(),
    };
    setActiveChatId(null);
    setMessages([welcomeMessage]);
    setInput("");
    setTitle("New Conversation");
    router.replace(`/assistant/`);
  }, [router]);

  useEffect(() => {
    if (messages.length === 0 && !isLoading && !error) {
      createNewChat();
    }
    // Only run when messages, isLoading, or error changes
  }, [messages, isLoading, error, chat, createNewChat]);

  useEffect(() => {
    if (!chatId) {
      // Reset to welcome message when no chatId in URL
      createNewChat();
    }
    // Optionally, you can also clear isProcessing if needed
  }, [chatId, createNewChat]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedInput = input.trim();
    if (!trimmedInput || isProcessing) return;

    const userMessage: ChatMessageType = {
      content: trimmedInput,
      role: "USER",
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);

    try {
      const assistantResponse = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: activeChatId,
          message: trimmedInput,
        }),
      });

      const assistantReply = await assistantResponse.json();

      console.log("Assistant Reply:", assistantReply);
      console.log("Current ID:", activeChatId);
      console.log("Response ID:", assistantReply.sessionId);

      if (!assistantResponse.ok) {
        throw new Error(assistantReply.error || "Failed to fetch response");
      }

      const assistantMessage: ChatMessageType = {
        content: assistantReply.reply,
        role: "ASSISTANT",
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (assistantReply.title) {
        setTitle(assistantReply.title);
      }

      if (!activeChatId) {
        setActiveChatId(assistantReply.sessionId);
        router.replace(`/assistant?chatId=${assistantReply.sessionId}`);
      }
    } catch (error) {
      console.error("Error fetching response:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (isLoading) return <ChatSkeleton />;
  if (error) throw new Error("Failed to load chat history");

  return (
    <div className="flex h-[calc(100vh-200px)] min-h-[500px] gap-5">
      <ChatHistorySidebar />

      <div className="flex flex-1 flex-col rounded-lg border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <h2 className="font-semibold">
            {title}
          </h2>
        </div>

        <ScrollArea className="flex p-4 h-[calc(100vh-335px)]">
          <div className="space-y-4 pb-4">
            {messages.map((message, index) => (
              <ChatMessage key={index} {...message} />
            ))}

            {isProcessing && (
              <div className="flex items-center space-x-2 text-muted-foreground p-4 rounded-lg bg-muted/50 max-w-[80%]">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p className="text-sm">Thinking...</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="min-h-[60px] flex-1 resize-none"
              disabled={isProcessing}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isProcessing}
              className={cn(
                "h-[60px] w-[60px]",
                isProcessing && "opacity-50 cursor-not-allowed"
              )}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

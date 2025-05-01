"use client"

import type React from "react"
import { useState } from "react" // Keep useEffect for other purposes if needed, but not for resize
import { PlusCircle, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import { useChats } from "@/routes/chat"
import ChatHistorySkeleton from "../ui/skeletons/assistant/chatHistorySkeleton"
import { useRouter, useSearchParams } from "next/navigation"

// Added className prop for styling consistency
export function ChatHistorySidebar({ className }: { className?: string }) {

  const params = useSearchParams()
  const router = useRouter()

  const activeChat = params.get("chatId") as string | null

  const { chats, isLoading, error, mutate } = useChats() // Assuming mutate is available from SWR

  // State for sidebar visibility (controls mobile slide-in/out and desktop hide/show)
  const [isOpen, setIsOpen] = useState(true); // Default to open on desktop, closed on mobile might need adjustment
  const [chatToDelete, setChatToDelete] = useState<string | null>(null); // For delete confirmation

  // Toggle function for both mobile and desktop
  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);

    // Add a timeout to ensure smooth transition before applying focus or other actions
    if (!isOpen) {
      setTimeout(() => {
        const firstFocusableElement = document.querySelector(
          '.chat-history-sidebar button, .chat-history-sidebar a'
        );
        (firstFocusableElement as HTMLElement | null)?.focus();
      }, 300); // Match the transition duration
    }
  };

  // --- Navigation and Action Logic ---
  const onSelectChat = (chatId: string) => {
    router.push(`/assistant?chatId=${chatId}`)
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) { // Use 1024px as the lg breakpoint
       setIsOpen(false);
    }
  }

  const onNewChat = () => {
    // Logic to create a new chat (e.g., API call)
    // For now, just navigate to the base assistant page, assuming it handles creation
    router.push('/assistant');
    // Close sidebar on mobile after action
    if (window.innerWidth < 1024) {
       setIsOpen(false);
    }
  };

  const confirmDelete = async () => { // Make async if your delete logic is async
    if (chatToDelete) {
      try {
        // Example: await fetch(`/api/ai/chat/${chatToDelete}`, { method: 'DELETE' });
        // After successful deletion, update local state via SWR's mutate
        mutate(chats?.filter(chat => chat.id !== chatToDelete), false); // Optimistic update

        // Navigate away if the active chat was deleted
        if (activeChat === chatToDelete) {
          router.push('/assistant'); // Navigate to base chat page
        }
      } catch (err) {
        console.error("Failed to delete chat:", err);
        // Handle error (e.g., show toast notification)
        mutate(); // Revalidate data if optimistic update failed
      } finally {
        setChatToDelete(null); // Close dialog
      }
    }
  };
  // --- End Navigation and Action Logic ---

  // Handle loading and error states
  if (isLoading) return <ChatHistorySkeleton />; // Provide default width for skeleton
  if (error) {
     console.error("Failed to load chat history:", error);
     return (
        <div className={cn("flex flex-col border-r bg-background w-64 p-4", className)}>
           <div className="text-destructive">Error loading history.</div>
        </div>
     );
  }

  return (
    <div>
      {/* Button to open sidebar on mobile (visible only when closed) */}
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "rounded-full shadow-md", // Visible only when closed
          isOpen ? "hidden" : "block"
        )}
        onClick={toggleSidebar}
        aria-label="Open chat history"
      >
        <ChevronRight className="h-4 w-4 mx-auto" />
      </Button>

      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden" // Only visible on mobile when open
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r bg-background transition-transform duration-300 lg:relative lg:translate-x-0", // Base styles, fixed on mobile, relative on desktop
          isOpen ? "block" : "hidden", // Slide in/out on mobile
          isOpen ? "w-64" : "w-0", // Control width when open/closed (affects mobile slide and desktop hide)
          !isOpen && "border-none", // Hide border when fully closed
          className,
        )}
      >
        {/* Sidebar Content */}
        <div className="flex w-64 flex-col h-200 chat-history-sidebar"> {/* Added class for focusable elements */}
          <div className="flex items-center justify-between p-4 border-b shrink-0">
            <h2 className="font-semibold">Chat History</h2>
            {/* Close button (visible on all sizes when open) */}
            <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Close chat history">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-2 shrink-0">
            <Button onClick={onNewChat} className="w-full justify-start" variant={activeChat ? "ghost" : "default"}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Chat
            </Button>
          </div>

          <ScrollArea className="flex-1 overflow-y-auto">
            {chats?.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">No chat history yet</div>
            ) : (
              <div className="space-y-1 p-2">
                {chats?.map((chat) => (
                  <Button
                    key={chat.id}
                    variant={activeChat === chat.id ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start text-left h-auto py-2 group",
                      activeChat === chat.id ? "bg-secondary hover:bg-secondary/90" : "hover:bg-accent"
                    )}
                    onClick={() => onSelectChat(chat.id)}
                  >
                    <div className="flex w-full items-center">
                      <MessageSquare className="mr-2 h-4 w-4 shrink-0" />
                      <div className="flex-1 truncate">
                        <div className="truncate font-medium">{chat.title || `Chat ${chat.id.substring(0, 6)}`}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={chatToDelete !== null} onOpenChange={(open: boolean) => !open && setChatToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this chat? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setChatToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

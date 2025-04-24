import { User, Bot } from "lucide-react"
import { cn } from "@/lib/utils"
import { ChatMessageType } from "@/lib/types/chat/types"

export function ChatMessage(message: ChatMessageType) {
  const isUser = message.role === "USER"
  const timestamp = message.createdAt.toLocaleString()
  return (
    <div className={cn("flex items-start gap-4 rounded-lg p-4", isUser ? "bg-primary/10" : "bg-muted/50")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border",
          isUser ? "bg-primary text-primary-foreground" : "bg-background",
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <p className="font-medium">{isUser ? "You" : "Assistant"}</p>
          <span className="text-xs text-muted-foreground">{timestamp}</span>
        </div>

        <div className="prose prose-sm max-w-none">
          <p>{message.content}</p>
        </div>
      </div>
    </div>
  )
}

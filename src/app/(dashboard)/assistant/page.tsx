import { AssistantChat } from "@/components/assistant/assistantChat"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AI Assistant | Travel Money App",
  description: "Get help with currency exchange and travel money questions",
}

export default function AssistantPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">AI Assistant</h1>
        <p className="text-muted-foreground">
          Ask questions about currency exchange, travel money, or get help with using the app
        </p>
      </div>
      <AssistantChat />
    </div>
  )
}

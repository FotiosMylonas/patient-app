import { useEffect, useRef, useState } from "react";
import { api } from "../services/api";
import type { Conversation, Message } from "../services/types";
import MessageBubble from "../components/MessageBubble";

export default function Messages() {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getConversations();
        setConversation(data[0] ?? null);
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages.length]);

  function handleSend() {
    const text = draft.trim();
    if (!text || !conversation) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      from: "patient",
      text,
      timestamp: new Date().toISOString(),
      read: true,
    };

    //  update
    setConversation({
      ...conversation,
      messages: [...conversation.messages, newMessage],
      lastMessageAt: newMessage.timestamp,
    });
    setDraft("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // when 'enter' --> send
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6 space-y-4">
        <div className="h-8 w-48 bg-bg-secondary rounded animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 bg-bg-secondary rounded-card animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="p-4 sm:p-6">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Messages</h1>
        <div className="bg-bg-secondary border border-border rounded-card p-6 text-center">
          <p className="text-text-secondary">No conversations yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      {/* Header --> practitioner info */}
      <header className="p-4 sm:p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center font-medium">
            {conversation.practitioner.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium">{conversation.practitioner.name}</p>
            <p className="text-text-secondary text-xs">
              {conversation.practitioner.role}
            </p>
          </div>
        </div>
      </header>

      {/* Messages list which is scrollable */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
        {conversation.messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer */}
      <div className="p-3 sm:p-4 border-t border-border bg-bg-primary">
        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 bg-bg-secondary border border-border rounded-button px-3 py-2 text-sm resize-none focus:outline-none focus:border-accent transition-colors max-h-32"
          />
          <button
            onClick={handleSend}
            disabled={!draft.trim()}
            className="bg-accent hover:bg-accent-hover disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-button w-10 h-10 flex items-center justify-center transition-colors"
            aria-label="Send message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
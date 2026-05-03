import { useState, useEffect, useRef } from "react";
import { apiUrl } from "@/lib/api";
import { useListConversations, useCreateConversation, useGetConversation, getListConversationsQueryKey } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Plus, Send, Sprout, User, Bot, Loader2, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface LocalMessage {
  id: number | string;
  role: string;
  content: string;
}

const QUICK_QUESTIONS = [
  "Gehun mein kya khaad daalein?",
  "Dhan ki bimari kaise rokein?",
  "PM-KISAN yojana kya hai?",
  "Fasal bima kaise karaaein?",
];

export default function Chatbot() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [localMessages, setLocalMessages] = useState<LocalMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: conversations, isLoading: loadingConversations } = useListConversations({
    query: { queryKey: getListConversationsQueryKey() }
  });

  const { data: activeConversation } = useGetConversation(
    activeId!,
    { query: { enabled: !!activeId } }
  );

  const createMutation = useCreateConversation({
    mutation: {
      onSuccess: (data) => {
        setActiveId(data.id);
        queryClient.invalidateQueries({ queryKey: getListConversationsQueryKey() });
      }
    }
  });

  useEffect(() => {
    if (activeConversation?.messages && !isStreaming) {
      setLocalMessages(activeConversation.messages);
    }
  }, [activeConversation, isStreaming]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [localMessages, isStreaming]);

  useEffect(() => {
    if (conversations && conversations.length > 0 && !activeId) {
      setActiveId(conversations[0].id);
    }
  }, [conversations, activeId]);

  const handleNewChat = () => {
    createMutation.mutate({ data: { title: "Nai Baat" } });
    setLocalMessages([]);
  };

  const sendMessage = async (text: string, conversationId: number) => {
    const userMsg: LocalMessage = { id: Date.now(), role: "user", content: text };
    const assistantMsg: LocalMessage = { id: Date.now() + 1, role: "assistant", content: "" };
    setLocalMessages(prev => [...prev, userMsg, assistantMsg]);
    setIsStreaming(true);

    try {
      const response = await fetch(apiUrl(`/api/openai/conversations/${conversationId}/messages`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text })
      });

      if (!response.ok) throw new Error("Stream failed");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) {
                  setLocalMessages(prev => {
                    const msgs = [...prev];
                    const last = msgs[msgs.length - 1];
                    if (last.role === "assistant") last.content += data.content;
                    return msgs;
                  });
                }
              } catch {}
            }
          }
        }
      }
    } catch (err) {
      setLocalMessages(prev => {
        const msgs = [...prev];
        const last = msgs[msgs.length - 1];
        if (last.role === "assistant") last.content = "Kuch gadbad hui. Dobara try karein.";
        return msgs;
      });
    } finally {
      setIsStreaming(false);
      queryClient.invalidateQueries({ queryKey: getListConversationsQueryKey() });
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    const text = input.trim();
    setInput("");

    if (activeId) {
      await sendMessage(text, activeId);
    } else {
      // Auto-create conversation then send
      const res = await fetch(apiUrl("/api/openai/conversations"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: text.slice(0, 40) })
      });
      const convo = await res.json();
      setActiveId(convo.id);
      queryClient.invalidateQueries({ queryKey: getListConversationsQueryKey() });
      await sendMessage(text, convo.id);
    }
  };

  const handleQuickQuestion = (q: string) => {
    setInput(q);
  };

  const switchConversation = (id: number) => {
    setActiveId(id);
    setLocalMessages([]);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4 animate-in fade-in duration-500">
      {/* Conversations sidebar */}
      <Card className="w-72 hidden lg:flex flex-col border-none ring-1 ring-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-bold text-primary flex items-center gap-2 text-sm">
            <MessageSquare className="h-4 w-4" /> Baatein
          </h2>
          <Button
            variant="ghost" size="icon"
            onClick={handleNewChat}
            disabled={createMutation.isPending}
            className="h-8 w-8 text-primary hover:bg-primary/10"
            title="Nai baat shuru karein"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1 p-2">
          {loadingConversations ? (
            <div className="space-y-2 p-2">
              {[1,2,3].map(i => <div key={i} className="h-10 bg-muted animate-pulse rounded-lg" />)}
            </div>
          ) : conversations && conversations.length > 0 ? (
            <div className="space-y-1">
              {conversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => switchConversation(conv.id)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 group",
                    activeId === conv.id
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/70 hover:bg-muted hover:text-foreground"
                  )}
                >
                  <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate flex-1">{conv.title}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-center text-muted-foreground text-sm p-4">
              <MessageSquare className="h-8 w-8 mb-2 opacity-30" />
              <p>Koi baat nahi abhi.</p>
              <p className="text-xs mt-1">Niche kuch poochein!</p>
            </div>
          )}
        </ScrollArea>
      </Card>

      {/* Main chat area */}
      <Card className="flex-1 flex flex-col border-none ring-1 ring-border shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border bg-primary/5 flex items-center gap-3">
          <div className="bg-primary p-2 rounded-full text-primary-foreground">
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-foreground">Krishi Mitra AI</h2>
            <p className="text-xs text-muted-foreground">Khet, fasal, mausam — kuch bhi poochein</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-5 bg-background">
          {localMessages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="bg-primary/10 p-5 rounded-full mb-4">
                <Bot className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Krishi Mitra mein aapka swagat hai!</h3>
              <p className="text-muted-foreground text-sm max-w-sm mb-6">
                Gehun, dhan, keet, khaad, yojana ya mausam — koi bhi sawaal poochein. Main aapki madad ke liye hamesha taiyaar hun.
              </p>
              <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleQuickQuestion(q)}
                    className="text-left text-xs font-medium bg-muted/60 hover:bg-primary/10 hover:text-primary border border-border rounded-xl px-3 py-2.5 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {localMessages.map((msg, i) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3 max-w-[85%]",
                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "h-8 w-8 shrink-0 rounded-full flex items-center justify-center mt-0.5 shadow-sm",
                msg.role === "user" ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"
              )}>
                {msg.role === "user" ? <User className="h-4 w-4" /> : <Sprout className="h-4 w-4" />}
              </div>
              <div className={cn(
                "px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-card border border-border text-foreground rounded-tl-sm"
              )}>
                {msg.content || (isStreaming && i === localMessages.length - 1
                  ? <span className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Soch raha hun...</span>
                  : ""
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-muted/5">
          <form onSubmit={handleSend} className="flex items-center gap-2 max-w-3xl mx-auto">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Kuch bhi poochein — gehun, dhan, khet, yojana..."
              className="flex-1 h-12 rounded-xl border-border bg-background text-sm shadow-sm focus-visible:ring-primary/30"
              disabled={isStreaming}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isStreaming}
              className="h-12 w-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
            >
              {isStreaming ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </form>
          <p className="text-center text-xs text-muted-foreground mt-2">
            AI galti kar sakta hai — zaroori faislon mein local krishi expert se salah zaroor lein
          </p>
        </div>
      </Card>
    </div>
  );
}

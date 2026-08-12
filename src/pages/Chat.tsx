import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Lock, Send, Shield, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

const Chat = () => {
  const { conversationId } = useParams();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [otherUser, setOtherUser] = useState<any>(null);
  const [sending, setSending] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profile || !conversationId) return;

    const loadConversation = async () => {
      const { data: conv } = await supabase
        .from("conversations")
        .select("*")
        .eq("id", conversationId)
        .single();

      if (!conv) {
        toast.error("Conversa não encontrada");
        navigate(-1);
        return;
      }
      setConversation(conv);

      // Load other user
      const otherUserId = conv.company_user_id === profile.id ? conv.freelancer_user_id : conv.company_user_id;
      const { data: user } = await supabase
        .from("public_profiles")
        .select("user_id, name, type")
        .eq("user_id", otherUserId)
        .single();
      setOtherUser(user ? { id: user.user_id, name: user.name, type: user.type } : null);

      // Load messages
      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });
      setMessages(msgs || []);
    };

    loadConversation();

    // Realtime subscription
    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as any]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile, conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleUnlock = async () => {
    if (!conversation || !profile) return;
    setUnlocking(true);

    // Check balance
    if ((profile.balance ?? 0) < (conversation.unlock_price ?? 4.90)) {
      toast.error(`Saldo insuficiente. Preço: R$ ${conversation.unlock_price ?? 4.90}`);
      setUnlocking(false);
      return;
    }

    // Deduct balance and unlock
    const newBalance = (profile.balance ?? 0) - (conversation.unlock_price ?? 4.90);
    const { error: balanceErr } = await supabase
      .from("users")
      .update({ balance: newBalance })
      .eq("id", profile.id);

    if (balanceErr) {
      toast.error("Erro ao processar pagamento");
      setUnlocking(false);
      return;
    }

    const { error: unlockErr } = await supabase
      .from("conversations")
      .update({ unlocked: true })
      .eq("id", conversation.id);

    if (unlockErr) {
      toast.error("Erro ao desbloquear chat");
      setUnlocking(false);
      return;
    }

    // Record payment
    await supabase.from("payments").insert({
      from_user_id: profile.id,
      to_user_id: "00000000-0000-0000-0000-000000000000",
      amount: conversation.unlock_price ?? 4.90,
      status: "paid",
    });

    setConversation({ ...conversation, unlocked: true });
    toast.success("Chat desbloqueado! 🎉");
    setUnlocking(false);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !profile || !conversation?.unlocked) return;
    setSending(true);

    const { error } = await supabase.from("messages").insert({
      conversation_id: conversation.id,
      sender_id: profile.id,
      content: newMessage.trim(),
    });

    if (error) {
      toast.error("Erro ao enviar mensagem");
    } else {
      setNewMessage("");
    }
    setSending(false);
  };

  if (!conversation || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-secondary/90 backdrop-blur-md border-b border-secondary-foreground/5">
        <div className="container flex items-center gap-3 h-14">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-secondary-foreground/70">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <img src={logo} alt="Trampô" className="w-7 h-7" />
          <div className="flex-1">
            <p className="font-bold text-secondary-foreground text-sm">{otherUser?.name || "..."}</p>
            <p className="text-xs text-secondary-foreground/50">{otherUser?.type === "company" ? "Empresa" : "Freelancer"}</p>
          </div>
          {conversation.unlocked ? (
            <Badge className="bg-success/10 text-success text-xs">Desbloqueado</Badge>
          ) : (
            <Badge className="bg-accent/10 text-accent text-xs"><Lock className="h-3 w-3 mr-1" /> Bloqueado</Badge>
          )}
        </div>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 max-w-2xl mx-auto w-full">
        {/* Security notice */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 mb-4">
          <Shield className="h-4 w-4 text-primary shrink-0" />
          <span>Números de telefone, emails e redes sociais são bloqueados automaticamente para sua segurança.</span>
        </div>

        {!conversation.unlocked ? (
          <Card className="border-primary/20 max-w-sm mx-auto mt-8">
            <CardContent className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-bold text-foreground text-lg">Chat bloqueado</h3>
              <p className="text-sm text-muted-foreground">
                Desbloqueie este chat por <span className="font-bold text-foreground">R$ {(conversation.unlock_price ?? 4.90).toFixed(2).replace('.', ',')}</span> para conversar com {otherUser?.name}.
              </p>
              <Button
                variant="hero"
                className="w-full"
                onClick={handleUnlock}
                disabled={unlocking}
              >
                {unlocking ? "Processando..." : `Desbloquear por R$ ${(conversation.unlock_price ?? 4.90).toFixed(2).replace('.', ',')}`}
              </Button>
              <p className="text-xs text-muted-foreground">Seu saldo: R$ {profile.balance?.toFixed(2) ?? "0.00"}</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {messages.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Nenhuma mensagem ainda. Comece a conversa!</p>
              </div>
            )}
            {messages.map((msg) => {
              const isMine = msg.sender_id === profile.id;
              return (
                <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                      isMine
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className={`text-[10px] mt-1 ${isMine ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                      {new Date(msg.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input bar */}
      {conversation.unlocked && (
        <div className="sticky bottom-0 bg-background border-t border-border p-3">
          <div className="max-w-2xl mx-auto flex gap-2">
            <Input
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              className="flex-1"
              maxLength={500}
            />
            <Button
              variant="hero"
              size="icon"
              onClick={handleSend}
              disabled={!newMessage.trim() || sending}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;

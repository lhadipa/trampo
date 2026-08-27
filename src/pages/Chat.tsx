import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockPayments, supabase } from "@/integrations/supabase/client";
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
  // Saldo devolvido pelo servidor apos cada operacao simulada; enquanto null,
  // vale o valor carregado no perfil.
  const [balance, setBalance] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profile || !conversationId) return;

    if (conversationId.startsWith("demo-")) {
      const isConv1 = conversationId === "demo-conv-1";
      setConversation({
        id: conversationId,
        unlocked: isConv1,
        unlock_price: 4.90,
        company_user_id: profile.type === "empresa" ? profile.id : "other-company",
        freelancer_user_id: profile.type === "empresa" ? "other-freelancer" : profile.id,
      });

      setOtherUser({
        id: "demo-other",
        name: profile.type === "empresa" ? (isConv1 ? "Carlos Eduardo (Pintor)" : "Rodrigo (Piscineiro)") : "Restaurante & Hotel Fazenda Solar",
        type: profile.type === "empresa" ? "freelancer" : "company",
      });

      setMessages([
        {
          id: "m-1",
          conversation_id: conversationId,
          sender_id: "demo-other",
          content: isConv1 ? "Olá! Tudo bem? Vi a vaga de pintura em SJDR e tenho total disponibilidade." : "Olá! Trabalho com manutenção de piscinas em toda a região das Vertentes.",
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: "m-2",
          conversation_id: conversationId,
          sender_id: profile.id,
          content: isConv1 ? "Excelente Carlos! Precisamos para iniciar amanhã cedo. O valor de R$ 180 pela diária está de acordo?" : "Ótimo! O serviço é para a sexta-feira.",
          created_at: new Date(Date.now() - 1800000).toISOString(),
        },
        {
          id: "m-3",
          conversation_id: conversationId,
          sender_id: "demo-other",
          content: isConv1 ? "Perfeito! Estarei no local amanhã às 08:00 com os equipamentos." : "Combinado! Pode contar comigo.",
          created_at: new Date(Date.now() - 900000).toISOString(),
        },
      ]);
      return;
    }

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

    // A API local nao tem canal de realtime, entao as mensagens do outro lado
    // chegam por consulta periodica. So substitui a lista quando algo mudou,
    // para nao rolar a tela a cada ciclo.
    const intervalo = setInterval(async () => {
      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });
      if (!msgs) return;
      setMessages((prev) => (prev.length === msgs.length ? prev : msgs));
    }, 5000);

    return () => clearInterval(intervalo);
  }, [profile, conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleUnlock = async () => {
    if (!conversation || !profile) return;
    setUnlocking(true);

    if (conversationId?.startsWith("demo-")) {
      setTimeout(() => {
        setConversation({ ...conversation, unlocked: true });
        toast.success("Chat desbloqueado com sucesso! 🎉");
        setUnlocking(false);
      }, 500);
      return;
    }

    // Debito de saldo, desbloqueio e registro do pagamento acontecem em uma
    // transacao no servidor -- o cliente nao pode escrever no proprio saldo.
    const { data, error } = await mockPayments.unlockChat(conversation.id);

    if (error) {
      toast.error(error.message);
      setUnlocking(false);
      return;
    }

    setConversation(data.conversation ?? { ...conversation, unlocked: true });
    if (typeof data.balance === "number") setBalance(data.balance);
    toast.success("Chat desbloqueado! 🎉 (pagamento simulado)");
    setUnlocking(false);
  };

  const handleTopup = async () => {
    if (conversationId?.startsWith("demo-")) {
      toast.success("Saldo simulado adicionado");
      return;
    }
    setUnlocking(true);
    const { data, error } = await mockPayments.topup(50);
    if (error) toast.error(error.message);
    else {
      setBalance(data.balance);
      toast.success("R$ 50,00 adicionados (simulado)");
    }
    setUnlocking(false);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !profile || !conversation?.unlocked) return;
    setSending(true);

    const messageText = newMessage.trim();

    if (conversationId?.startsWith("demo-")) {
      const msgObj = {
        id: `demo-msg-${Date.now()}`,
        conversation_id: conversation.id,
        sender_id: profile.id,
        content: messageText,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, msgObj]);
      setNewMessage("");
      setSending(false);

      // Simular resposta automática em 1.5s
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `demo-msg-reply-${Date.now()}`,
            conversation_id: conversation.id,
            sender_id: "demo-other",
            content: "Recebido! Confirmo que estarei presente no horário combinado. Obrigado pela oportunidade!",
            created_at: new Date().toISOString(),
          },
        ]);
      }, 1500);
      return;
    }

    const { data, error } = await supabase.from("messages").insert({
      conversation_id: conversation.id,
      sender_id: profile.id,
      content: messageText,
    });

    if (error) {
      toast.error("Erro ao enviar mensagem");
    } else {
      // A API local nao tem realtime -- supabase.channel() e' um stub. Sem
      // acrescentar a mensagem aqui ela so apareceria ao recarregar a tela.
      const enviada = Array.isArray(data) ? data[0] : data;
      if (enviada) setMessages((prev) => (prev.some((m) => m.id === enviada.id) ? prev : [...prev, enviada]));
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
              <p className="text-xs text-muted-foreground">Seu saldo: R$ {(balance ?? profile.balance ?? 0).toFixed(2)}</p>
              <Button variant="outline" size="sm" className="w-full" onClick={handleTopup} disabled={unlocking}>
                Adicionar R$ 50 (saldo simulado)
              </Button>
              <p className="text-[10px] text-muted-foreground">
                Ambiente de demonstração: nenhum pagamento real é processado.
              </p>
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

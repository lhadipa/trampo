import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Lock, MessageSquare, Unlock } from "lucide-react";
import logo from "@/assets/logo.png";

const Conversations = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    const load = async () => {
      const { data } = await supabase
        .from("conversations")
        .select("*")
        .order("created_at", { ascending: false });

      if (!data) {
        setLoading(false);
        return;
      }

      // Load other user names
      const enriched = await Promise.all(
        data.map(async (conv: any) => {
          const otherUserId = conv.company_user_id === profile.id ? conv.freelancer_user_id : conv.company_user_id;
          const { data: user } = await supabase
            .from("public_profiles")
            .select("name, type")
            .eq("user_id", otherUserId)
            .single();

          // Get last message
          const { data: lastMsg } = await supabase
            .from("messages")
            .select("content, created_at")
            .eq("conversation_id", conv.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          return { ...conv, otherUser: user, lastMessage: lastMsg };
        })
      );

      setConversations(enriched);
      setLoading(false);
    };
    load();
  }, [profile]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-secondary/90 backdrop-blur-md border-b border-secondary-foreground/5">
        <div className="container flex items-center gap-3 h-14">
          <Button variant="ghost" size="icon" onClick={() => navigate("/painel")} className="text-secondary-foreground/70">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <img src={logo} alt="Trampô" className="w-7 h-7" />
          <span className="font-bold text-secondary-foreground">Conversas</span>
        </div>
      </header>

      <main className="container py-6 max-w-2xl mx-auto">
        {loading ? (
          <p className="text-center text-muted-foreground py-8">Carregando...</p>
        ) : conversations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center space-y-3">
              <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto" />
              <p className="text-muted-foreground">Nenhuma conversa ainda.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv) => (
              <Card
                key={conv.id}
                className="border-border hover:border-primary/30 transition-colors cursor-pointer"
                onClick={() => navigate(`/chat/${conv.id}`)}
              >
                <CardContent className="pt-4 pb-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${conv.unlocked ? "bg-success/10" : "bg-muted"}`}>
                    {conv.unlocked ? (
                      <Unlock className="h-4 w-4 text-success" />
                    ) : (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{conv.otherUser?.name || "Usuário"}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {conv.lastMessage?.content || (conv.unlocked ? "Nenhuma mensagem" : "Chat bloqueado")}
                    </p>
                  </div>
                  {!conv.unlocked && (
                    <Badge className="bg-accent/10 text-accent text-xs shrink-0">R$ {conv.unlock_price}</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Conversations;

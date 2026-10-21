import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BriefcaseBusiness, Check, Clock3, Save, UserRound } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { SERVICE_CATEGORIES } from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ProfileForm = { serviceTypes: string[]; workTypes: string[]; experienceYears: string; bio: string };
const emptyForm: ProfileForm = { serviceTypes: [], workTypes: [], experienceYears: "0", bio: "" };

const Profile = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [freelancerId, setFreelancerId] = useState<string | null>(null);
  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const allWorkTypes = useMemo(() => SERVICE_CATEGORIES.flatMap((category) => category.subservices), []);

  useEffect(() => {
    const load = async () => {
      if (!profile) return;
      const { data } = await supabase.from("freelancers").select("*").eq("user_id", profile.id).maybeSingle();
      if (data) {
        setFreelancerId(data.id);
        setForm({ serviceTypes: data.service_types || (data.category ? [data.category] : []), workTypes: data.work_types || [], experienceYears: String(data.experience_years ?? 0), bio: data.bio || "" });
      } else {
        const { data: created } = await supabase.from("freelancers").insert({ user_id: profile.id, category: "" }).select().single();
        if (created) setFreelancerId(created.id);
      }
    };
    load();
  }, [profile]);

  const toggle = (field: "serviceTypes" | "workTypes", value: string) => setForm((current) => ({ ...current, [field]: current[field].includes(value) ? current[field].filter((item) => item !== value) : [...current[field], value] }));

  const handleSave = async () => {
    if (!freelancerId) return;
    if (!form.serviceTypes.length || !form.workTypes.length) { toast.error("Selecione pelo menos uma área e um tipo de trabalho."); return; }
    setSaving(true);
    const { error } = await supabase.from("freelancers").update({ category: form.serviceTypes[0], service_types: form.serviceTypes, work_types: form.workTypes, experience_years: Number(form.experienceYears), bio: form.bio.trim() }).eq("id", freelancerId);
    setSaving(false);
    if (error) toast.error(`Não foi possível salvar: ${error.message}`);
    else toast.success("Perfil salvo no banco local", { description: "Suas áreas, experiência e bio foram atualizadas." });
  };

  if (!profile) return null;
  return <div className="min-h-screen bg-background pb-12">
    <header className="sticky top-0 z-50 bg-secondary/90 backdrop-blur-md border-b border-secondary-foreground/5"><div className="container flex items-center justify-between h-14 max-w-3xl mx-auto px-4"><Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-secondary-foreground/70"><ArrowLeft className="h-4 w-4 mr-1" /> Voltar</Button><span className="font-bold text-secondary-foreground flex items-center gap-2"><UserRound className="h-4 w-4" /> Meu perfil</span><span className="w-16" /></div></header>
    <main className="container py-8 max-w-3xl mx-auto px-4 space-y-6">
      <div><p className="text-sm font-semibold text-primary">Perfil profissional</p><h1 className="text-3xl font-bold text-foreground mt-1">Mostre o que você faz</h1><p className="text-sm text-muted-foreground mt-2 max-w-xl">Essas informações ajudam empresas a encontrar você para as diárias certas.</p></div>
      <Card className="border-border rounded-2xl"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><BriefcaseBusiness className="h-5 w-5 text-primary" /> Áreas de serviço</CardTitle><p className="text-xs text-muted-foreground">Escolha uma ou mais áreas em que você trabalha.</p></CardHeader><CardContent className="grid gap-3 sm:grid-cols-2">{SERVICE_CATEGORIES.map((category) => { const selected = form.serviceTypes.includes(category.name); return <button type="button" key={category.id} onClick={() => toggle("serviceTypes", category.name)} className={`text-left rounded-xl border p-4 transition-colors ${selected ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}><span className="flex items-center justify-between gap-3"><span className="text-sm font-semibold">{category.name}</span><span className={`h-5 w-5 rounded-full border flex items-center justify-center ${selected ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30"}`}>{selected && <Check className="h-3.5 w-3.5" />}</span></span><span className="block text-xs text-muted-foreground mt-1">{category.description}</span></button>; })}</CardContent></Card>
      <Card className="border-border rounded-2xl"><CardHeader><CardTitle className="text-base">Tipos de trabalho</CardTitle><p className="text-xs text-muted-foreground">Marque os serviços que você executa ({form.workTypes.length} selecionados).</p></CardHeader><CardContent className="grid gap-2 sm:grid-cols-2">{allWorkTypes.map((work) => { const selected = form.workTypes.includes(work); return <button type="button" key={work} onClick={() => toggle("workTypes", work)} className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-sm ${selected ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:border-primary/40"}`}><span className={`h-4 w-4 shrink-0 rounded border flex items-center justify-center ${selected ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/40"}`}>{selected && <Check className="h-3 w-3" />}</span>{work}</button>; })}</CardContent></Card>
      <Card className="border-border rounded-2xl"><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Clock3 className="h-5 w-5 text-primary" /> Experiência e apresentação</CardTitle></CardHeader><CardContent className="space-y-5"><div className="space-y-2 max-w-xs"><Label htmlFor="experience">Tempo de trabalho</Label><div className="flex items-center gap-2"><Input id="experience" type="number" min="0" max="60" value={form.experienceYears} onChange={(event) => setForm({ ...form, experienceYears: event.target.value })} /><span className="text-sm text-muted-foreground">anos</span></div></div><div className="space-y-2"><Label htmlFor="bio">Bio profissional</Label><Textarea id="bio" maxLength={500} value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} placeholder="Conte brevemente sobre sua experiência e seu jeito de trabalhar..." className="min-h-32" /><p className="text-right text-xs text-muted-foreground">{form.bio.length}/500</p></div></CardContent></Card>
      <Button variant="hero" size="lg" className="w-full shadow-warm" onClick={handleSave} disabled={saving}><Save className="h-4 w-4 mr-2" />{saving ? "Salvando..." : "Salvar meu perfil"}</Button>
    </main>
  </div>;
};
export default Profile;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, Check, MessageSquareQuote, Save, Star, UserRound } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SERVICE_CATEGORIES } from "@/lib/categories";

type Kind = "company" | "pessoa_fisica";
type ContractorProfileData = { serviceTypes: string[]; bio: string };

const MOCK_REVIEWS = [
  { name: "Mariana Alves", initials: "MA", rating: 5, text: "Contratação muito tranquila e objetiva. O pagamento foi combinado com clareza.", date: "há 2 semanas" },
  { name: "João Pedro", initials: "JP", rating: 5, text: "Empresa organizada, comunicação rápida e respeito pelo profissional.", date: "há 1 mês" },
  { name: "Camila Souza", initials: "CS", rating: 4, text: "Boa experiência no geral. Recomendo para outros profissionais.", date: "há 2 meses" },
];

const ContractorProfile = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [kind, setKind] = useState<Kind>("company");
  const [name, setName] = useState("");
  const [document, setDocument] = useState("");
  const [recordId, setRecordId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ContractorProfileData>({ serviceTypes: [], bio: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile) return;
    const load = async () => {
      const { data: company } = await supabase.from("companies").select("*").eq("user_id", profile.id).maybeSingle();
      if (company) { setKind("company"); setRecordId(company.id); setName(company.corporate_name || company.name || ""); setDocument(company.cnpj || ""); setProfileData({ serviceTypes: company.preferred_service_types || [], bio: company.bio || "" }); return; }
      const { data: person } = await supabase.from("individual_contractors").select("*").eq("user_id", profile.id).maybeSingle();
      if (person) { setKind("pessoa_fisica"); setRecordId(person.id); setName(person.full_name || profile.name); setDocument(person.cpf || ""); setProfileData({ serviceTypes: person.preferred_service_types || [], bio: person.bio || "" }); }
      else setName(profile.name || "");
    };
    load();
  }, [profile]);

  const toggleService = (value: string) => setProfileData((current) => ({ ...current, serviceTypes: current.serviceTypes.includes(value) ? current.serviceTypes.filter((item) => item !== value) : [...current.serviceTypes, value] }));

  const handleSave = async () => {
    if (!profile || !name.trim() || !document.trim()) { toast.error("Preencha o nome e o documento."); return; }
    setSaving(true);
    const table = kind === "company" ? "companies" : "individual_contractors";
    const payload = kind === "company"
      ? { name: name.trim(), corporate_name: name.trim(), cnpj: document.trim(), preferred_service_types: profileData.serviceTypes, bio: profileData.bio.trim() }
      : { full_name: name.trim(), cpf: document.trim(), preferred_service_types: profileData.serviceTypes, bio: profileData.bio.trim(), updated_at: new Date().toISOString() };
    let result: any;
    if (recordId) result = await supabase.from(table).update(payload).eq("id", recordId);
    else {
      const { data: existing } = await supabase.from(table).select("*").eq("user_id", profile.id).maybeSingle();
      if (existing) { setRecordId(existing.id); result = await supabase.from(table).update(payload).eq("id", existing.id); }
      else result = await supabase.from(table).insert({ ...payload, user_id: profile.id }).select().single();
    }
    setSaving(false);
    if (result.error) toast.error(`Não foi possível salvar: ${result.error.message}`);
    else { if (result.data?.id) setRecordId(result.data.id); toast.success("Perfil de contratante salvo no banco de dados."); }
  };

  if (!profile) return null;
  return <div className="min-h-screen bg-background pb-12">
    <header className="sticky top-0 z-50 bg-secondary/90 backdrop-blur-md border-b border-secondary-foreground/5"><div className="container flex items-center justify-between h-14 max-w-3xl mx-auto px-4"><Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-secondary-foreground/70"><ArrowLeft className="h-4 w-4 mr-1" /> Voltar</Button><span className="font-bold text-secondary-foreground flex items-center gap-2"><Building2 className="h-4 w-4" /> Perfil de contratante</span><span className="w-16" /></div></header>
    <main className="container py-8 max-w-3xl mx-auto px-4 space-y-6"><div><p className="text-sm font-semibold text-primary">Perfil de contratante</p><h1 className="text-3xl font-bold text-foreground mt-1">Encontre os profissionais certos</h1><p className="text-sm text-muted-foreground mt-2">Conte um pouco sobre você e os serviços que costuma contratar.</p></div><Card className="rounded-2xl border-border"><CardHeader><CardTitle>Dados de quem contrata</CardTitle><p className="text-sm text-muted-foreground">Escolha o tipo de contratante. Esses dados ficam salvos no banco e aparecem nos seus registros.</p></CardHeader><CardContent className="space-y-5">
      <div className="grid grid-cols-2 gap-2"><Button type="button" variant={kind === "company" ? "default" : "outline"} onClick={() => { setKind("company"); setRecordId(null); setDocument(""); }}>Empresa</Button><Button type="button" variant={kind === "pessoa_fisica" ? "default" : "outline"} onClick={() => { setKind("pessoa_fisica"); setRecordId(null); setDocument(""); }}><UserRound className="h-4 w-4 mr-2" /> Pessoa física</Button></div>
      <div className="space-y-2"><Label htmlFor="contractor-name">{kind === "company" ? "Nome corporativo / razão social" : "Nome completo"}</Label><Input id="contractor-name" value={name} onChange={e => setName(e.target.value)} /></div>
      <div className="space-y-2"><Label htmlFor="contractor-document">{kind === "company" ? "CNPJ" : "CPF"}</Label><Input id="contractor-document" value={document} onChange={e => setDocument(e.target.value)} placeholder={kind === "company" ? "00.000.000/0001-00" : "000.000.000-00"} /></div>
    </CardContent></Card>
    <Card className="rounded-2xl border-border"><CardHeader><CardTitle>O que você mais quer contratar?</CardTitle><p className="text-sm text-muted-foreground">Selecione uma ou mais opções para personalizar suas recomendações ({profileData.serviceTypes.length} selecionados).</p></CardHeader><CardContent className="space-y-5">{SERVICE_CATEGORIES.map((category) => <div key={category.id}><p className="text-sm font-semibold mb-2">{category.name}</p><div className="flex flex-wrap gap-2">{category.subservices.map((service) => { const selected = profileData.serviceTypes.includes(service); return <button type="button" key={service} onClick={() => toggleService(service)} className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-left text-xs transition-colors ${selected ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:border-primary/40"}`}>{selected && <Check className="h-3.5 w-3.5 text-primary" />}{service}</button>; })}</div></div>)}</CardContent></Card>
    <Card className="rounded-2xl border-border"><CardHeader><CardTitle>Bio do contratante</CardTitle><p className="text-sm text-muted-foreground">Apresente sua empresa ou seu jeito de trabalhar para os profissionais.</p></CardHeader><CardContent><Textarea maxLength={500} value={profileData.bio} onChange={(event) => setProfileData({ ...profileData, bio: event.target.value })} placeholder="Ex.: Somos uma empresa de eventos que busca profissionais comprometidos..." className="min-h-32" /><p className="text-right text-xs text-muted-foreground mt-2">{profileData.bio.length}/500</p></CardContent></Card>
    <Card className="rounded-2xl border-border"><CardHeader><div className="flex items-start justify-between gap-4"><div><CardTitle className="flex items-center gap-2"><MessageSquareQuote className="h-5 w-5 text-primary" />Centro de avaliações</CardTitle><p className="text-sm text-muted-foreground mt-1">Uma prévia de como sua reputação aparecerá para os profissionais.</p></div><span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md">MOCK</span></div></CardHeader><CardContent className="space-y-5"><div className="flex flex-col sm:flex-row gap-5 sm:items-center"><div className="text-center sm:border-r sm:pr-7"><p className="text-4xl font-extrabold">4,8</p><div className="flex justify-center text-primary my-1">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-4 w-4 fill-current" />)}</div><p className="text-xs text-muted-foreground">12 avaliações</p></div><div className="flex-1 space-y-1.5">{[[5, 9], [4, 2], [3, 1]].map(([stars, count]) => <div key={stars} className="flex items-center gap-2 text-xs"><span className="w-8">{stars} <Star className="inline h-3 w-3 fill-current text-primary" /></span><div className="h-2 flex-1 rounded-full bg-muted overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${count / 12 * 100}%` }} /></div><span className="w-5 text-right text-muted-foreground">{count}</span></div>)}</div></div><div className="grid gap-3">{MOCK_REVIEWS.map((review) => <div key={review.name} className="rounded-xl border border-border p-4"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><div className="h-9 w-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">{review.initials}</div><div><p className="text-sm font-semibold">{review.name}</p><div className="flex items-center gap-1 text-primary">{Array.from({ length: review.rating }).map((_, index) => <Star key={index} className="h-3 w-3 fill-current" />)}</div></div></div><span className="text-xs text-muted-foreground">{review.date}</span></div><p className="text-sm text-muted-foreground mt-3">{review.text}</p></div>)}</div></CardContent></Card>
    <Button variant="hero" size="lg" className="w-full shadow-warm" onClick={handleSave} disabled={saving}><Save className="h-4 w-4 mr-2" />{saving ? "Salvando..." : "Salvar perfil"}</Button>
    </main>
  </div>;
};

export default ContractorProfile;

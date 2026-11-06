import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SERVICE_CATEGORIES } from "@/lib/categories";

type Preference = { id: string; location_id: string; category_id: string };
type Location = { id: string; displayName: string; neighborhood: string };

export const ProfessionalPreferencesPanel = ({
  preferences,
  locations,
  onRemove,
}: { preferences: Preference[]; locations: Location[]; onRemove: (id: string) => void }) => (
  <section className="space-y-3" aria-labelledby="private-preferences-title">
    <div><h2 id="private-preferences-title" className="font-bold">Preferências privadas</h2><p className="text-sm text-muted-foreground">Locais e categorias onde você gostaria de trabalhar. Isso não é uma candidatura.</p></div>
    {preferences.length ? preferences.map((preference) => {
      const location = locations.find((item) => item.id === preference.location_id);
      const category = SERVICE_CATEGORIES.find((item) => item.id === preference.category_id);
      return <Card key={preference.id} className="pilot-surface"><CardContent className="flex flex-wrap items-center justify-between gap-3 p-5"><div><p className="font-bold">{location?.displayName ?? "Local não disponível"}</p><p className="text-sm text-muted-foreground">{category?.name ?? preference.category_id}{location ? ` · ${location.neighborhood}` : ""}</p><p className="mt-1 text-xs text-muted-foreground">O contratante vê somente uma contagem agregada, nunca seu perfil.</p></div><Button size="sm" variant="outline" onClick={() => onRemove(preference.id)} aria-label={`Remover preferência por ${category?.name ?? preference.category_id} em ${location?.displayName ?? "local"}`}>Remover preferência</Button></CardContent></Card>;
    }) : <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">Você ainda não salvou preferências de local ou categoria.</div>}
  </section>
);

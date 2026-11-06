from pathlib import Path
from datetime import date
import os

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "docs/security-audit/relatorio-auditoria-seguranca.pdf"
TMP = ROOT / "docs/security-audit/tmp"
TMP.mkdir(parents=True, exist_ok=True)
os.environ.setdefault("MPLCONFIGDIR", str(TMP / "mplconfig"))

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from reportlab.lib import colors
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image

PALETTE = {"Crítica":"#B91C1C", "Alta":"#EA580C", "Média":"#D97706", "Baixa":"#2563EB", "Ponto forte":"#059669"}
FINDINGS = [
    {"sev":"Alta", "cat":"IDOR / CRUD", "loc":"server/index.js:71; 579-608", "title":"POST de preferências aceita user_id controlado pelo cliente", "desc":"A policy de preferences habilita insert, mas o bloco de validações de POST cobre apenas jobs, applications, conversations, messages e reviews. O INSERT usa todas as colunas enviadas no body, incluindo user_id, sem substituí-lo pelo usuário autenticado.", "impact":"Um usuário autenticado pode criar preferências associadas à conta de outro usuário, poluindo dados privados e permitindo manipulação de estado em nome de terceiros. A rota dedicada /api/preferences é protegida, mas o app mobile usa o CRUD genérico.", "fix":"Remover preferences do CRUD genérico ou sobrescrever/validar user_id no servidor; preferir a rota dedicada já existente e cobrir o app mobile com ela.", "snippet":"preferences: { insert: true, update: false }; ... INSERT INTO ${table} (${cols.join(',')}) ... values do body", "accept":["POST com user_id de terceiro retorna 403","user_id nunca é aceito do cliente para preferências","Mobile usa endpoint dedicado com escopo por sessão"]},
    {"sev":"Crítica", "cat":"IDOR / CRUD", "loc":"server/index.js:611-639", "title":"PATCH genérico altera objetos sem validação de posse", "desc":"A rota /api/data/:table permite PATCH para qualquer tabela cujo policy.update seja undefined. O código valida apenas a presença de eq.* e, para tabelas sem regra own/adminOnly, monta UPDATE diretamente com os filtros fornecidos pelo chamador.", "impact":"Qualquer usuário autenticado pode alterar registros de jobs, applications, conversations, messages ou reviews informando o ID de outro objeto. O risco inclui mudança de status, vínculos e conteúdo de terceiros.", "fix":"Adotar deny-by-default: toda tabela deve declarar operações, campos e regra de ownership; rejeitar PATCH para tabelas sem política explícita e aplicar a posse na própria cláusula WHERE.", "snippet":"const rule = policy.update; ... if (!filters.length) ...; UPDATE ${table} SET ... WHERE ${where}", "accept":["PATCH sem política explícita retorna 403","A posse é aplicada no SQL, não apenas no frontend","Testes cobrem cada tabela e IDs de terceiros"]},
    {"sev":"Alta", "cat":"Banco sem tranca", "loc":"server/index.js:93-120; 642-657", "title":"Leitura pública de perfis retorna campos de todas as empresas", "desc":"O mecanismo de isolamento é filtro manual por user.id. Entretanto, appendReadScope libera integralmente jobs, freelancers, companies e public_profiles para qualquer usuário autenticado. A consulta final usa SELECT * sem projeção por campo.", "impact":"Um usuário autenticado consegue enumerar perfis de empresas e receber campos internos como cnpj, além de outros atributos que sejam adicionados ao schema. Não há tenant/workspace; a exposição depende apenas de possuir uma sessão válida.", "fix":"Separar dados públicos de dados privados, selecionar allowlists de colunas e proteger identificadores empresariais. Não usar SELECT * para tabelas expostas a múltiplos papéis.", "snippet":"if (privilegedRead || [\"jobs\", \"freelancers\", \"companies\", \"public_profiles\"].includes(table)) return; ... SELECT * FROM ${table}", "accept":["Leituras públicas retornam somente campos públicos","CNPJ e atributos internos não aparecem para terceiros","Testes de enumeração entre dois usuários passam"]},
    {"sev":"Média", "cat":"Chaves expostas", "loc":"docker-compose.local.yml:9,23-24; server/seed.js:13,22; README.md:6,41,63", "title":"Credenciais e defaults funcionais estão no repositório", "desc":"O Compose contém senha do PostgreSQL e JWT_SECRET funcional de desenvolvimento; seed e documentação divulgam defaults de DATABASE_URL e senha das contas demo. O histórico Git também contém esses arquivos versionados.", "impact":"Se o Compose ou seed for reutilizado fora de um ambiente isolado, as credenciais previsíveis permitem acesso ao banco ou emissão/aceitação de tokens com segredo conhecido. As contas demo são acessíveis por qualquer pessoa com os dados documentados.", "fix":"Mover valores para ambiente local não versionado, exigir segredos explícitos e fortes fora de desenvolvimento, abortar com defaults conhecidos e rotacionar credenciais já compartilhadas.", "snippet":"POSTGRES_PASSWORD: trampo_local_dev; JWT_SECRET: trampo_local_jwt_dev_change_me; process.env.SEED_PASSWORD || \"trampo123\"", "accept":["Nenhum segredo funcional fica em Compose, seed ou docs","Startup rejeita defaults conhecidos fora de local","Credenciais já divulgadas são rotacionadas"]},
]
STRONG = [
    ("Stack e auth", "Node.js/Express, PostgreSQL via pg, React/Vite, React Native/Expo, JWT próprio com jsonwebtoken e bcrypt. Não há ORM, RLS, Helm ou Terraform."),
    ("Autenticação", "jwt.verify valida o token e userFrom carrega o usuário por users.id (server/index.js:146-155). Login compara senha com bcrypt (server/index.js:238-245)."),
    ("Admin", "O update de users exige adminOnly (server/index.js:69, 611-615) e leituras com scope=admin exigem isAdmin (server/index.js:576-578)."),
    ("Fluxos críticos", "Aceite, check-in, conclusão e desbloqueio de chat usam rotas dedicadas, verificam participantes e transações PostgreSQL."),
    ("XSS", "A busca encontrou apenas dangerouslySetInnerHTML em src/components/ui/chart.tsx:69-80, usado para CSS gerado por ChartConfig estático. Não foi encontrado dado de usuário entrando nesse sink, nem eval/new Function/v-html/markdown sem sanitização."),
    ("Histórico e bundle", ".env não está versionado; a busca no histórico encontrou os arquivos de configuração e defaults auditados, sem chave externa adicional distinta. O bundle é Vite e não contém uma chave de provedor identificada nesta revisão."),
]
def esc(s): return str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="Cover", parent=styles["Title"], fontSize=25, leading=31, alignment=TA_CENTER, textColor=HexColor("#12304A"), spaceAfter=15))
styles.add(ParagraphStyle(name="H1x", parent=styles["Heading1"], fontSize=18, leading=22, textColor=HexColor("#12304A"), spaceBefore=8, spaceAfter=10))
styles.add(ParagraphStyle(name="H2x", parent=styles["Heading2"], fontSize=12, leading=15, textColor=HexColor("#12304A"), spaceBefore=8, spaceAfter=5))
styles.add(ParagraphStyle(name="Bodyx", parent=styles["BodyText"], fontSize=9, leading=12.5, spaceAfter=5))
styles.add(ParagraphStyle(name="Smallx", parent=styles["BodyText"], fontSize=7.3, leading=9.5, textColor=HexColor("#475569")))
styles.add(ParagraphStyle(name="Issue", parent=styles["Code"], fontName="Courier", fontSize=6.7, leading=8.5, leftIndent=6, rightIndent=6, backColor=HexColor("#F8FAFC"), borderColor=HexColor("#CBD5E1"), borderWidth=.5, borderPadding=6))
def P(text, style="Bodyx"): return Paragraph(esc(text), styles[style])
def rich(text, style="Bodyx"): return Paragraph(text, styles[style])
def charts():
    counts = {k: sum(1 for f in FINDINGS if f["sev"] == k) for k in ["Crítica","Alta","Média","Baixa"]}
    labels=[k for k,v in counts.items() if v]; vals=[v for v in counts.values() if v]
    fig,ax=plt.subplots(figsize=(4.8,3.0),dpi=180); ax.pie(vals,labels=labels,colors=[PALETTE[k] for k in labels],startangle=90,wedgeprops={"width":.38,"edgecolor":"white"},autopct="%1.0f"); ax.set_title("Achados por severidade",fontsize=11,weight="bold"); fig.tight_layout(); donut=TMP/"severidade.png"; fig.savefig(donut,transparent=True); plt.close(fig)
    cats=["Banco sem\ntranca","Permissão\nno navegador","IDOR","Chaves\nexpostas","XSS"]; vals=[1,0,2,1,0]
    fig,ax=plt.subplots(figsize=(5.3,3.0),dpi=180); bars=ax.bar(cats,vals,color=[PALETTE["Alta"],PALETTE["Ponto forte"],PALETTE["Crítica"],PALETTE["Média"],PALETTE["Ponto forte"]]); ax.set_ylim(0,1.35); ax.set_ylabel("Quantidade"); ax.set_title("Achados por categoria",fontsize=11,weight="bold"); ax.grid(axis="y",alpha=.2)
    for b,v in zip(bars,vals): ax.text(b.get_x()+b.get_width()/2,v+.04,str(v),ha="center",weight="bold")
    fig.tight_layout(); bar=TMP/"categorias.png"; fig.savefig(bar,transparent=True); plt.close(fig); return donut,bar
def footer(canvas,doc):
    canvas.saveState(); canvas.setStrokeColor(HexColor("#CBD5E1")); canvas.line(2*cm,1.4*cm,A4[0]-2*cm,1.4*cm); canvas.setFont("Helvetica",7.5); canvas.setFillColor(HexColor("#64748B")); canvas.drawString(2*cm,1*cm,"Relatório de Auditoria de Segurança - Trampô"); canvas.drawRightString(A4[0]-2*cm,1*cm,f"Página {doc.page}"); canvas.restoreState()
def issue(f,n):
    md=[f"--- ISSUE {n} ---",f"# [Segurança] {f['title']}",f"Labels sugeridas: security, severity:{f['sev'].lower()}","","## Descrição",f["desc"],"","## Evidência",f["loc"],f"Trecho: {f['snippet']}","","## Impacto",f["impact"],"","## Sugestão de correção",f["fix"],"","## Critérios de aceite"]+[f"- [ ] {x}" for x in f["accept"]]+["",f"--- FIM ISSUE {n} ---"]
    return "\n".join(md)
def build():
    donut,bar=charts(); counts={k:sum(1 for f in FINDINGS if f["sev"]==k) for k in ["Crítica","Alta","Média","Baixa"]}
    doc=SimpleDocTemplate(str(OUT),pagesize=A4,rightMargin=2*cm,leftMargin=2*cm,topMargin=1.8*cm,bottomMargin=1.8*cm,title="Relatório de Auditoria de Segurança - Trampô",author="Codex")
    story=[Spacer(1,3*cm),rich("Relatório de Auditoria de Segurança - Trampô","Cover"),P("Auditoria estática orientada a cinco categorias de risco","Smallx"),Spacer(1,1*cm),rich(f"<b>Data:</b> {date.today().strftime('%d/%m/%Y')}<br/><b>Escopo:</b> API Express, React/Vite, React Native/Expo, PostgreSQL, Docker Compose, Render, Vercel, scripts, docs, histórico Git e bundle web.<br/><br/><b>Nota metodológica:</b> o isolamento foi mapeado para filtros manuais de ownership na API; gates de papel foram cruzados com handlers Express; todos os handlers foram listados e lidos; segredos foram buscados em código, configs, docs, histórico e bundle; XSS foi mapeado para sinks React/HTML reais.","Bodyx"),PageBreak()]
    story += [rich("Resumo executivo","H1x"),P(f"Foram confirmados {len(FINDINGS)} achados acionáveis: {counts['Crítica']} crítico, {counts['Alta']} alto e {counts['Média']} médio. Não houve achado verificável nas categorias de permissão definida no navegador e XSS."),Table([[P(k,"Smallx") for k in ["Crítica","Alta","Média","Baixa","Pontos fortes"]],[P(str(counts['Crítica']),"H2x"),P(str(counts['Alta']),"H2x"),P(str(counts['Média']),"H2x"),P("0","H2x"),P(str(len(STRONG)),"H2x")]],colWidths=[3.1*cm]*5,style=TableStyle([("BACKGROUND",(0,0),(0,1),HexColor(PALETTE["Crítica"])),("BACKGROUND",(1,0),(1,1),HexColor(PALETTE["Alta"])),("BACKGROUND",(2,0),(2,1),HexColor(PALETTE["Média"])),("BACKGROUND",(3,0),(3,1),HexColor(PALETTE["Baixa"])),("BACKGROUND",(4,0),(4,1),HexColor(PALETTE["Ponto forte"])),("TEXTCOLOR",(0,0),(-1,0),colors.white),("ALIGN",(0,0),(-1,-1),"CENTER"),("BOX",(0,0),(-1,-1),.5,HexColor("#CBD5E1")),("TOPPADDING",(0,0),(-1,-1),7),("BOTTOMPADDING",(0,0),(-1,-1),7)])),Spacer(1,8),Table([[Image(str(donut),width=8.2*cm,height=5.1*cm),Image(str(bar),width=9.2*cm,height=5.1*cm)]],style=TableStyle([("VALIGN",(0,0),(-1,-1),"MIDDLE")])),PageBreak()]
    story += [rich("Stack e modelo de segurança","H1x"),P("Backend próprio Express com consultas SQL parametrizadas por pg; autenticação por JWT e bcrypt; frontend React/Vite; app React Native/Expo; PostgreSQL; Docker Compose local; Render e Vercel. Não existe RLS, ORM, middleware de tenant ou workspace: o isolamento depende de filtros manuais por user.id e relações SQL."),rich("Pontos fortes","H1x")]
    for title,text in STRONG: story += [rich(f"<b>{esc(title)}:</b> {esc(text)}","Bodyx")]
    story += [rich("Pontos fracos centrais","H1x"),P("O CRUD genérico ainda é permissivo por padrão para atualizações não declaradas; leituras de tabelas classificadas como públicas retornam SELECT *; defaults funcionais de banco, JWT e contas demo estão documentados/versionados."),PageBreak(),rich("Achados detalhados","H1x")]
    rows=[[P("Severidade","Smallx"),P("Arquivo:linha","Smallx"),P("Descrição","Smallx")]]
    for f in FINDINGS: rows.append([rich(f"<font color='{PALETTE[f['sev']]}'><b>{esc(f['sev'])}</b></font>","Smallx"),P(f["loc"],"Smallx"),rich(f"<b>{esc(f['title'])}</b><br/>{esc(f['desc'])}","Smallx")])
    story += [Table(rows,colWidths=[2.4*cm,4.2*cm,9.6*cm],repeatRows=1,style=TableStyle([("BACKGROUND",(0,0),(-1,0),HexColor("#12304A")),("TEXTCOLOR",(0,0),(-1,0),colors.white),("GRID",(0,0),(-1,-1),.35,HexColor("#CBD5E1")),("VALIGN",(0,0),(-1,-1),"TOP"),("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.white,HexColor("#F8FAFC")]),("TOPPADDING",(0,0),(-1,-1),6),("BOTTOMPADDING",(0,0),(-1,-1),6)])),PageBreak(),rich("Recomendações priorizadas","H1x"),P("P1 - Remover o comportamento permissivo do CRUD: deny-by-default, allowlist de tabelas/campos/operações e ownership no SQL. P2 - Criar projeções públicas explícitas e retirar SELECT * de tabelas multiusuário. P3 - Eliminar defaults de segredo, exigir valores fortes em startup e rotacionar credenciais compartilhadas. P4 - Adicionar testes de autorização com dois usuários e testes de enumeração/IDOR para todos os handlers."),rich("ISSUES PARA O GITHUB","H1x")]
    for i,f in enumerate(FINDINGS,1): story += [rich(f"<b>ISSUE {i}</b>","H2x"),Paragraph(esc(issue(f,i)).replace("\n","<br/>"),styles["Issue"]),Spacer(1,8)]
    doc.build(story,onFirstPage=footer,onLaterPages=footer)
if __name__ == "__main__": build()

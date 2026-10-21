from pathlib import Path
import os
from datetime import date
ROOT = Path(__file__).resolve().parents[2]
os.environ.setdefault("MPLCONFIGDIR", str(ROOT / "docs" / "security-audit" / "tmp" / "mplconfig"))
import matplotlib
matplotlib.use("Agg")
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.lib.colors import HexColor
import matplotlib.pyplot as plt

OUT = ROOT / "docs" / "security-audit" / "relatorio-auditoria-seguranca.pdf"
CHART_DIR = ROOT / "docs" / "security-audit" / "tmp"
CHART_DIR.mkdir(parents=True, exist_ok=True)

palette = {"Crítica": "#B91C1C", "Alta": "#EA580C", "Média": "#D97706", "Baixa": "#2563EB", "Ponto forte": "#059669"}
findings = [
    {"sev": "Alta", "cat": "Banco sem tranca", "loc": "server/index.js:522-548", "title": "Leituras do CRUD genérico expõem dados de outras contas", "desc": "A rota GET /api/data/:table aplica filtro de identidade apenas a contracts, proposals e escrow. users, payments, jobs, applications, conversations, messages, reviews e demais tabelas podem ser listadas por qualquer usuário autenticado, sem user_id, company_id ou vínculo de tenant.", "impact": "Um usuário autenticado pode consultar PII, candidaturas, mensagens, pagamentos e dados operacionais de terceiros. Explorável sempre que a API estiver acessível com uma sessão válida.", "fix": "Definir uma política de leitura por tabela e montar o WHERE com a posse/participação do usuário no servidor; negar tabelas sem regra explícita.", "snippet": "if (table === contracts/proposals/escrow) adiciona escopo; const where = clauses.length ? WHERE ... : ''; SELECT * FROM ${table} ${where}", "accept": ["Cada tabela tem uma regra de escopo server-side explícita", "Testes com dois usuários confirmam que listagem/busca não cruza contas", "Admin possui rota separada e auditada para dados globais"]},
    {"sev": "Alta", "cat": "Permissão definida no navegador", "loc": "src/pages/DashboardAdmin.tsx:37-46; server/index.js:470-478", "title": "Dados administrativos são acessíveis sem papel admin", "desc": "O frontend mostra o painel por meio de isAdmin e, no painel, solicita users, payments, jobs e escrow. Entretanto, a rota genérica só exige autenticação e bloqueio de conta; não há verificação admin para GET dessas tabelas.", "impact": "Qualquer usuário autenticado pode reproduzir as chamadas do painel e obter dados administrativos, ainda que não veja a UI de admin. A ocultação do navegador não é uma barreira de autorização.", "fix": "Exigir isAdmin(user) no servidor para endpoints administrativos e separar leituras operacionais de rotas públicas/participativas.", "snippet": "DashboardAdmin: supabase.from(users/payments/jobs/escrow).select(*); API: if (!user) ... if (user.blocked) ...; SELECT sem isAdmin", "accept": ["Usuário não-admin recebe 403 em cada leitura administrativa", "Testes chamam os endpoints diretamente sem depender da UI", "Admin continua obtendo somente os campos necessários"]},
    {"sev": "Crítica", "cat": "IDOR", "loc": "server/index.js:481-488 e 491-519", "title": "CRUD genérico permite inserir e alterar objetos de terceiros", "desc": "Para tabelas sem policy específica, POST aceita qualquer payload e PATCH aceita qualquer eq.<coluna>=valor. Não existe verificação de posse para jobs, applications, conversations, messages, payments, escrow e reviews; o corpo também pode escolher IDs e relações.", "impact": "Com um token válido, um atacante pode alterar status, vínculos, mensagens ou registros financeiros de outro usuário, ou criar relações em nome de terceiros. O filtro obrigatório do PATCH evita UPDATE sem WHERE, mas não verifica autorização do objeto.", "fix": "Remover o CRUD genérico para dados sensíveis ou declarar allowlists de operação, campos e ownership por tabela; aplicar a condição de posse na própria query e validar relações no servidor.", "snippet": "const policy = policies[table] || {}; POST: INSERT INTO ${table} (...); PATCH: UPDATE ${table} SET ... WHERE ${where}; sem ownership para tabelas não listadas", "accept": ["PATCH/POST sem vínculo legítimo retorna 403", "Campos de ownership e saldo não são aceitos do cliente", "Testes cobrem cada tabela exposta e os casos path/query/body"]},
    {"sev": "Média", "cat": "Chaves expostas", "loc": "docker-compose.local.yml:9,23-24; server/seed.js:22; README.md:35,57", "title": "Credenciais e senha padrão ficam hardcoded no repositório", "desc": "O compose publica POSTGRES_PASSWORD=trampo_local_dev, DATABASE_URL com usuário/senha e JWT_SECRET=trampo_local_jwt_dev_change_me. O seed usa SEED_PASSWORD || trampo123 e a documentação divulga a senha das contas de demonstração.", "impact": "A condição de exploração é executar o compose/seed com esses defaults em ambiente acessível ou reutilizar a senha em uma implantação. O servidor rejeita JWT_SECRET ausente apenas em produção, mas seed e credenciais locais não têm validação equivalente.", "fix": "Usar .env.example sem valores funcionais, exigir segredos fortes e SEED_PASSWORD em qualquer execução não-local, rotacionar credenciais já compartilhadas e remover senhas reais da documentação.", "snippet": "POSTGRES_PASSWORD: trampo_local_dev | JWT_SECRET: trampo_local_jwt_dev_change_me | const PASSWORD = process.env.SEED_PASSWORD || trampo123", "accept": ["Nenhum valor funcional aparece em compose, scripts ou docs", "Startup/seed aborta diante de defaults ou produção sem segredo explícito", "Histórico e bundle são verificados após rotação"]},
]

strong = [
    ("Autenticação", "JWT é verificado com jwt.verify; userFrom carrega o usuário por id e rejeita token inválido (server/index.js:99-108). Senhas de login são comparadas com bcrypt (server/index.js:143-150)."),
    ("Fluxos críticos", "accept-application, check-in, complete e chat-unlock verificam o usuário relacionado ao contrato/conversa dentro de transações (server/index.js:210-430)."),
    ("Proteção contra UPDATE total", "PATCH exige ao menos um filtro eq.* (server/index.js:496-498) e nomes de colunas são validados por IDENT (server/index.js:80, 466-468)."),
    ("XSS", "Nenhum innerHTML, dangerouslySetInnerHTML, v-html, eval ou new Function foi encontrado em src/mobile; renderização React usa escape padrão. Não há achado XSS verificável nesta revisão."),
    ("Histórico", "Busca no histórico git por padrões de chaves e por trampo123 não encontrou um segredo adicional distinto dos defaults atuais; os defaults presentes no working tree continuam reportados acima."),
]

def chart_donut():
    labels = ["Crítica", "Alta", "Média"]
    vals = [1, 2, 1]
    fig, ax = plt.subplots(figsize=(5, 3.2), dpi=180)
    ax.pie(vals, labels=labels, colors=[palette[x] for x in labels], startangle=90, wedgeprops={"width": .38, "edgecolor": "white"}, autopct="%1.0f")
    ax.set_title("Achados por severidade", fontsize=12, weight="bold")
    fig.tight_layout(); path = CHART_DIR / "severidade.png"; fig.savefig(path, transparent=True); plt.close(fig); return path

def chart_bars():
    labels = ["Banco\nsem tranca", "Permissão\nno navegador", "IDOR", "Chaves\nexpostas", "XSS"]
    vals = [1, 1, 1, 1, 0]
    fig, ax = plt.subplots(figsize=(6.2, 3.2), dpi=180)
    bars = ax.bar(labels, vals, color=[palette["Alta"], palette["Alta"], palette["Crítica"], palette["Média"], palette["Ponto forte"]])
    ax.set_ylim(0, 1.35); ax.set_ylabel("Quantidade"); ax.set_title("Achados por categoria", fontsize=12, weight="bold"); ax.grid(axis="y", alpha=.2)
    for b, v in zip(bars, vals): ax.text(b.get_x()+b.get_width()/2, v+.04, str(v), ha="center", weight="bold")
    fig.tight_layout(); path = CHART_DIR / "categorias.png"; fig.savefig(path, transparent=True); plt.close(fig); return path

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="Cover", parent=styles["Title"], fontSize=26, leading=32, textColor=HexColor("#12304A"), alignment=TA_CENTER, spaceAfter=18))
styles.add(ParagraphStyle(name="H1x", parent=styles["Heading1"], fontSize=18, leading=22, textColor=HexColor("#12304A"), spaceBefore=8, spaceAfter=10))
styles.add(ParagraphStyle(name="H2x", parent=styles["Heading2"], fontSize=12, leading=15, textColor=HexColor("#12304A"), spaceBefore=8, spaceAfter=5))
styles.add(ParagraphStyle(name="Bodyx", parent=styles["BodyText"], fontSize=9.2, leading=13, spaceAfter=5))
styles.add(ParagraphStyle(name="Smallx", parent=styles["BodyText"], fontSize=7.5, leading=10, textColor=HexColor("#475569")))
styles.add(ParagraphStyle(name="Issue", parent=styles["Code"], fontName="Courier", fontSize=7.2, leading=9.5, leftIndent=8, rightIndent=8, backColor=HexColor("#F8FAFC"), borderColor=HexColor("#CBD5E1"), borderWidth=.5, borderPadding=7))

def P(text, style="Bodyx"): return Paragraph(text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"), styles[style])
def rich(text, style="Bodyx"): return Paragraph(text, styles[style])

def footer(canvas, doc):
    canvas.saveState(); canvas.setStrokeColor(HexColor("#CBD5E1")); canvas.line(2*cm, 1.45*cm, A4[0]-2*cm, 1.45*cm)
    canvas.setFont("Helvetica", 7.5); canvas.setFillColor(HexColor("#64748B")); canvas.drawString(2*cm, 1*cm, "Relatório de Auditoria de Segurança - Trampo"); canvas.drawRightString(A4[0]-2*cm, 1*cm, f"Página {doc.page}"); canvas.restoreState()

def issue_md(f, n):
    lines = [f"--- ISSUE {n} ---", f"# [Segurança] {f['title']}", f"Labels sugeridas: `security`, `severity:{f['sev'].lower()}`", "", "## Descrição", f["desc"], "", "## Evidência", f"`{f['loc']}`", f"Trecho: {f.get('snippet', 'rota e lógica nas linhas indicadas do arquivo.')}", "", "## Impacto", f["impact"], "", "## Sugestão de correção", f["fix"], "", "## Critérios de aceite"]
    lines += [f"- [ ] {x}" for x in f["accept"]] + [f"", f"--- FIM ISSUE {n} ---"]
    return "<br/>".join(x.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;") for x in lines)

def build():
    donut, bars = chart_donut(), chart_bars()
    doc = SimpleDocTemplate(str(OUT), pagesize=A4, rightMargin=2*cm, leftMargin=2*cm, topMargin=1.8*cm, bottomMargin=1.8*cm, title="Relatório de Auditoria de Segurança - Trampo", author="Codex")
    story = [Spacer(1, 3.2*cm), rich("Relatório de Auditoria de Segurança - Trampo", "Cover"), P("Auditoria estática orientada a cinco categorias de risco", "Smallx"), Spacer(1, 1*cm), rich(f"<b>Data:</b> 29/08/2026<br/><b>Escopo:</b> API Express, frontend React/Vite, app React Native, PostgreSQL, Docker Compose, Render, Vercel, scripts, documentação e histórico Git.<br/><br/><b>Metodologia:</b> stack detectada pelo código real; isolamento mapeado para filtros manuais de ownership na API; autorização comparada entre gates React e rotas Express; handlers percorridos sistematicamente; segredos buscados no working tree, histórico e referências de bundle; sinks XSS buscados em web e mobile.", "Bodyx"), PageBreak()]
    story += [rich("Resumo executivo", "H1x"), P("Foram verificados 4 achados acionáveis: 1 crítico, 2 altos e 1 médio. A categoria XSS foi auditada e não apresentou achado verificável."), Table([[P("Crítica", "Smallx"), P("Alta", "Smallx"), P("Média", "Smallx"), P("Baixa", "Smallx"), P("Pontos fortes", "Smallx")], [P("1", "H2x"), P("2", "H2x"), P("1", "H2x"), P("0", "H2x"), P("5", "H2x")]], colWidths=[3.1*cm]*5, style=TableStyle([("BACKGROUND", (0,0),(0,1), HexColor(palette["Crítica"])), ("BACKGROUND", (1,0),(1,1), HexColor(palette["Alta"])), ("BACKGROUND", (2,0),(2,1), HexColor(palette["Média"])), ("BACKGROUND", (3,0),(3,1), HexColor(palette["Baixa"])), ("BACKGROUND", (4,0),(4,1), HexColor(palette["Ponto forte"])), ("TEXTCOLOR", (0,0),(-1,0), colors.white), ("ALIGN", (0,0),(-1,-1), "CENTER"), ("VALIGN", (0,0),(-1,-1), "MIDDLE"), ("BOX", (0,0),(-1,-1), .5, HexColor("#CBD5E1")), ("INNERGRID", (0,0),(-1,-1), .3, colors.white), ("TOPPADDING", (0,0),(-1,-1), 7), ("BOTTOMPADDING", (0,0),(-1,-1), 7)])), Spacer(1, 8), Table([[__import__('reportlab.platypus').platypus.Image(str(donut), width=8.5*cm, height=5.4*cm), __import__('reportlab.platypus').platypus.Image(str(bars), width=9.5*cm, height=5.0*cm)]], style=TableStyle([("VALIGN", (0,0),(-1,-1), "MIDDLE")])), PageBreak()]
    story += [rich("Pontos fortes e pontos fracos", "H1x")]
    for title, text in strong: story += [rich(f"<b>{title}</b> - {text}"), Spacer(1, 2)]
    story += [rich("<b>Pontos fracos centrais</b> - O CRUD genérico concentra leitura e escrita de tabelas sensíveis sem uma matriz completa de ownership. Isso torna a fronteira de segurança dependente de filtros opcionais enviados pelo cliente."), PageBreak()]
    story += [rich("Achados detalhados", "H1x"), P("Linhas abaixo são referências exatas no working tree auditado; os trechos são resumidos no relatório para manter a tabela legível.")]
    rows = [[rich("Severidade", "Smallx"), rich("Arquivo:linha", "Smallx"), rich("Descrição", "Smallx")]]
    for f in findings:
        rows.append([rich(f"<font color='{palette[f['sev']]}'>● {f['sev']}</font>"), P(f["loc"]), P(f["title"] + ". " + f["desc"])])
    t = Table(rows, colWidths=[2.4*cm, 4.6*cm, 10.0*cm], repeatRows=1, style=TableStyle([("BACKGROUND", (0,0),(-1,0), HexColor("#12304A")), ("TEXTCOLOR", (0,0),(-1,0), colors.white), ("GRID", (0,0),(-1,-1), .35, HexColor("#CBD5E1")), ("VALIGN", (0,0),(-1,-1), "TOP"), ("LEFTPADDING", (0,0),(-1,-1), 6), ("RIGHTPADDING", (0,0),(-1,-1), 6), ("TOPPADDING", (0,0),(-1,-1), 6), ("BOTTOMPADDING", (0,0),(-1,-1), 6)]))
    story += [t, PageBreak(), rich("Recomendações priorizadas", "H1x")]
    for p, text in [("P1", "Eliminar ou fechar o CRUD genérico para escrita e criar políticas server-side de ownership por tabela; começar por payments, escrow, messages, conversations, jobs e applications."), ("P2", "Adicionar autorização admin no servidor para leituras administrativas e testes de acesso direto com usuários não-admin."), ("P3", "Remover defaults funcionais de compose/seed/docs, exigir segredo de seed e rotacionar credenciais compartilhadas."), ("P4", "Manter os controles verificados: JWT/bcrypt, transações nos fluxos críticos, allowlist de colunas e React sem sinks HTML perigosos; adicionar testes de regressão de isolamento.")]: story += [rich(f"<b>{p}</b> - {text}"), Spacer(1, 5)]
    story += [PageBreak(), rich("ISSUES PARA O GITHUB", "H1x"), P("Issues completas, prontas para copiar e colar. Achados relacionados ao mesmo mecanismo foram mantidos em uma issue por risco.")]
    for i, f in enumerate(findings, 1): story += [rich(issue_md(f, i), "Issue"), Spacer(1, 10)]
    doc.build(story, onFirstPage=footer, onLaterPages=footer)

if __name__ == "__main__": build()

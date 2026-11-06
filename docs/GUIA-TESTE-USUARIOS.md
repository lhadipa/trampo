# Guia de testes do Trampô

Este documento explica o que já pode ser testado no piloto do Trampô e o resultado esperado em cada fluxo.

> O piloto usa valores e estados simulados. Não há pagamento real, contratação real ou cobrança de cartão.

## Acessos

### Ambiente publicado

- Web: https://trampo-hazel.vercel.app
- API: https://trampo-api-5azl.onrender.com

### Contas de teste

Se o ambiente estiver conectado ao banco de teste, use:

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | `admin@trampo.app` | `trampo123` |
| Empresa | `empresa@trampo.app` | `trampo123` |
| Profissional | `pintor@trampo.app` | `trampo123` |
| Profissional | `piscineiro@trampo.app` | `trampo123` |
| Profissional | `garcom@trampo.app` | `trampo123` |

Caso uma conta não exista no ambiente publicado, crie uma conta pela tela de cadastro ou rode o seed no ambiente local.

## Teste rápido da página inicial

1. Abra `/`.
2. Confirme que a página apresenta o Trampô, as categorias, a cobertura local e os dois caminhos: contratar ou encontrar trabalhos.
3. Confirme que os valores estão identificados como simulados.
4. Clique em **Quero contratar**, **Cadastrar-se** e **Entrar**.
5. Abra o menu em uma tela estreita e confirme que os links continuam acessíveis.
6. Navegue para **Termos** e confira se a página abre e permite voltar.

Resultado esperado: a landing page funciona sem rolagem horizontal e os botões levam aos fluxos corretos.

## Fluxo do profissional

1. Entre com uma conta profissional.
2. Abra `/painel`.
3. Confirme a presença do painel profissional, da busca de oportunidades e da lista de oportunidades.
4. Confira o mapa e a alternativa em lista.
5. Use **Buscar nesta área** e observe a atualização da área pesquisada.
6. Teste filtros por categoria, distância e valor quando disponíveis.
7. Abra uma oportunidade e registre interesse.
8. Adicione ou remova a oportunidade dos favoritos.
9. Abra **Disponibilidade** (`/disponibilidade`) e altere os dias/horários.
10. Abra **Meu perfil** (`/perfil`) e valide a edição dos dados permitidos.
11. Abra **Meus trampos** (`/meus-trampos`) e confirme o estado vazio ou os trabalhos simulados.
12. Abra **Conversas** (`/conversas`) e, quando houver conversa, entre no chat.

Resultado esperado: o profissional consegue pesquisar, visualizar oportunidades, registrar interesse, favoritar e controlar disponibilidade sem aparecer qualquer cobrança real.

### Testes de localização e mapa

- Negue a permissão de localização: a lista e a região-piloto devem continuar disponíveis.
- Simule falha dos tiles do mapa: a lista deve continuar funcionando.
- Use zoom de entrada e saída: o mapa deve permanecer utilizável.
- Reduza a janela para aproximadamente 360 px: não deve surgir rolagem horizontal.

## Fluxo da empresa/contratante

1. Entre com uma conta de empresa.
2. Abra `/painel` e confirme o painel do contratante.
3. Abra **Criar vaga** (`/criar-vaga`).
4. Preencha título, categoria, descrição, data, horário, valor e endereço.
5. Teste o preenchimento por CEP; se não funcionar, use o preenchimento manual.
6. Publique a vaga simulada e confirme o retorno ao painel.
7. Teste o fluxo de solicitação urgente em `/urgente`.
8. Abra **Perfil de contratante** (`/perfil-contratante`) e confira os dados da empresa.
9. Verifique os sinais agregados de interesse.

Resultado esperado: a empresa publica uma necessidade por categoria e local e vê somente informações agregadas. Não deve aparecer nome, contato, identificador, horário ou localização individual de profissionais.

## Fluxo administrativo

1. Entre com `admin@trampo.app`.
2. Abra `/painel`.
3. Confirme que o painel administrativo apresenta indicadores, usuários, empresas e profissionais.
4. Abra um registro para conferir detalhes e histórico.
5. Confirme que ações administrativas exigem o perfil correto e que os dados não aparecem para usuários comuns.

## Acessibilidade e responsividade

Teste nos tamanhos aproximados de 360 px, 768 px e 1280 px:

- navegar somente com `Tab`, `Shift + Tab`, `Enter` e `Esc`;
- verificar foco visível nos botões, links, campos, mapa e diálogos;
- abrir e fechar diálogos pelo teclado;
- conferir que textos não ficam cortados;
- habilitar “reduzir movimento” no navegador e confirmar que a interface continua utilizável;
- usar leitor de tela, verificando títulos, nomes dos botões e rótulos dos campos.

## Execução local para a equipe técnica

Requisitos: Node.js 22+.

```sh
npm install
npm run dev
```

Abra `http://localhost:8080`.

Para executar as verificações automatizadas:

```sh
npm test
npm run build
npx playwright test
```

## Resultado da última verificação local

- `npm run build`: passou.
- `npm test`: 63 testes passaram e 2 falharam.
- Falha 1: `src/test/dashboards.test.tsx` ainda espera interesses vazios, mas o mock atual já contém um interesse selecionado.
- Falha 2: `src/test/landing-pilot.test.tsx` tenta validar a landing enquanto o diálogo de pré-reserva está aberto.
- `npm run lint`: ainda falha por violações existentes, principalmente `any` explícito em arquivos web/mobile e alguns avisos de hooks.
- `npx playwright test`: 3 testes passaram e 7 falharam. As falhas atuais estão concentradas em expectativas antigas da landing/marketplace e em um teste que chama `page.setGeolocation`, API que não existe no objeto `Page` usado pela versão instalada do Playwright.

Esses resultados não substituem os testes manuais acima. Ao abrir uma falha, registre: ambiente, perfil usado, rota, tamanho da tela, passos, resultado esperado, resultado observado e, se possível, uma captura de tela.


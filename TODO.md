# TODO da skill dataviz-design

Lacunas encontradas em uso real. Cada item diz o que falta, onde entra e com que fonte.

## 1. ~~`references/tables.md`: falta a matriz de status~~ FEITO

**O que existe hoje.** A seção "Charts inside the table: heatmap, inline bars, sparklines" cobre
heatmap com **gradiente sobre escala quantitativa**: uma rampa, contínua ou em degraus, com mínimo
e máximo declarados, e a regra de um gradiente único para colunas que compartilham a métrica.

**O que não existe.** A **matriz de status** (matriz categórica de resultado): dezenas de linhas por
poucas colunas, onde a célula codifica um **estado nominal** (passou, passou em parte, falhou) e não
uma posição numa rampa. Exemplos do gênero: tabela de suporte de navegador tipo caniuse, matriz de
conformidade, matriz de cobertura de teste, e o caso que motivou este item: 63 endpoints por 4
cenários, com contagem de 0 a 10 na célula.

As regras de gradiente **não se aplicam**, e algumas contradizem o caso: aplicar rampa sequencial a
estado nominal é o anti-padrão "nominal category on a sequential color ramp" que o próprio
`perception.md` condena.

**Escrito** como a seção "The status matrix: nominal state, not a gradient", com as sete regras
abaixo e Bertin e Behrisch acrescentados às fontes do arquivo.

**Regras, com fonte:**

- Use a paleta de **status** (bom / atenção / crítico), nunca uma rampa sequencial: estado é nominal,
  e rampa implica ordem contínua que não existe. O `color.md` já separa status de sequencial, falta
  o ponteiro daqui para lá. — Munzner 2014; Wilke 2019
- **Reordene as linhas pelo padrão, nunca em ordem alfabética.** O poder da matriz está na permutação:
  agrupar linhas de comportamento idêntico faz a estrutura em blocos aparecer sozinha, e é o que
  transforma ruído em achado. — Bertin, *Sémiologie graphique*, 1967, e *Graphics and Graphic
  Information Processing*, 1981 (matriz reordenável); Behrisch et al., *Matrix Reordering Methods*,
  EuroVis STAR, 2016
- Dê **cabeçalho de grupo nomeando o padrão** ("bloqueiam nos Estados Unidos", "idênticas nas duas
  pontas") em vez de deixar o leitor inferir o bloco. — Few 2004 (agrupamento) + Knaflic 2015
- Aplique **cinza ao que está conforme e cor só à exceção**. Numa matriz de centenas de células,
  pintar todos os estados satura e nada salta: é o §14 "gray is the protagonist" dentro da tabela.
  — Knaflic, *Storytelling with Data*, 2015
- A **legenda mapeia cor para significado**, não mínimo e máximo. Uma matriz de status não tem escala,
  tem chave. — derivado de Cleveland & McGill 1984 (cor é canal nominal aqui)
- **A regra de alinhar número à direita não vale para grade de marca.** Célula com código de uma ou
  duas casas e preenchimento é marca, não coluna de magnitude: centralizar é correto, porque não há
  ordem de grandeza a empilhar. Registrar como **isenção explícita** da seção "Alignment and numeric
  typography", senão a regra atual acusa a matriz indevidamente. — Few 2004 lido no seu escopo
- O **canal redundante além da cor** numa matriz é o próprio número impresso na célula; não cabe ícone
  por célula com centenas delas. — WCAG 1.4.1 aplicado ao caso

**Anti-padrões a acrescentar:** matriz em ordem alfabética, que esconde o bloco; rampa sequencial para
estado nominal; todas as células pintadas, sem cinza de contexto; legenda com mínimo e máximo onde não
há escala; célula com cor e sem valor.

## 2. `scripts/chart-probe.js`: cobertura ainda parcial

O probe decide rolagem horizontal, texto cortado, colisão de rótulo, contraste de texto e de marca
(SVG, HTML, borda e box-shadow), equivalente textual, esquema de cor, piso de tamanho na marca, as
cinco regras de tabela que o DOM decide, e desde esta rodada `number-without-baseline` (§6) e
`no-as-of-date` (§10). São 22 checagens.

**Conscientemente fora de alcance**, para não ficarem como pendência que nunca fecha:

- `jargão sem explicação` (§10): a heurística seria sigla em caixa alta sem `abbr` ou `title`. Em
  domínio técnico isso acusa vocabulário legítimo em massa (num relatório do judiciário brasileiro,
  ESAJ, TRT, CNJ e PJe são termos, não jargão opaco). O custo em falso positivo supera o ganho.
- `dead end` (§3): depende de a superfície ser relatório linear, onde não clicar é correto, ou
  analítica, onde é defeito. O probe não tem como saber qual é. O §0.3 pede essa classificação ao
  humano, e é lá que a checagem deveria morar, não no script.
- `filtro sem feedback` (§1): exige interação, fora do alcance de um probe estático.

Enquanto isso, a execução emite `not-checked-here` em toda rodada, listando o que continua sendo
julgamento humano. Isso existe porque uma execução limpa foi confundida com revisão feita.

## 3. ~~`references/render-check.md`: a tabela de checagens está desatualizada~~ FEITO

A tabela "What it decides" documentava oito checagens contra vinte no código. Sincronizada: as vinte
estão documentadas, com a regra e a fonte de cada uma, e a frase de abertura da seção deixou de
prometer só SVG. Conferido nos dois sentidos, sem divergência.

Cruzamento automatizado em `scripts/check-docs-sync.js`, que falha se um lado tiver o que o outro não
tem. E `scripts/self-test.js` cobre o probe com 13 casos, cada um um bug que ele já teve; verificado
que a suíte falha quando o bug é reintroduzido, senão seria decoração.

## 4. ~~SKILL.md: o §11 é pulável na prática~~ FEITO

O fluxo de revisão tem uma metade mecânica com saída objetiva (o probe) e uma metade de julgamento
(§11 a §15). Na prática a primeira sequestra a atenção e a segunda é pulada, porque uma devolve
`LIMPO` e a outra exige ler `chart-choice.md`. Foi assim que uma barra empilhada passou por revisão
com a mensagem no segmento que flutua, e quem pegou foi o leitor, não a skill.

A seção Usage passou a exigir o §11 **primeiro e por escrito**, uma frase por gráfico no formato "a
relação é X, logo a forma é Y", antes de qualquer medição. O render check foi movido para o
fechamento, com a razão explícita: ele responde rápido e por isso sequestra a revisão quando vem
primeiro, e um probe sem achados não disse nada sobre a forma estar certa.

Reforço: `not-checked-here` aparece em toda execução, inclusive nas limpas, nomeando o que o probe
não decide.

## 5. §3 contra §0.3: resolvido, o §3 vale

Levantado que o §0.3 classifica a tela em reporting, monitoring, exploring ou functional, e que o §3
("no dead ends") é regra dura sem isentar reporting, o que parecia tensão: num relatório linear, não
clicar seria correto.

**Decisão: o §3 é a regra, superfície de dado tem que ser interativa.** Sem isenção por tipo de tela.

Dívida paga no relatório que originou este TODO: cada quadrado da grade leva à linha do endpoint na
tabela e abre o detalhe; cada linha da matriz abre as 10 tentativas de cada cenário, com código de
resposta e mediana; cada serviço do gráfico de custo abre a tarifa nas duas regiões; a linha de
latência abre a mediana de cada rodada. Tudo por clique e por teclado, com `aria-expanded`. O probe
mede 116 de 123 marcas clicáveis, e as 7 restantes são quadradinhos de legenda, que são chave e não
dado.

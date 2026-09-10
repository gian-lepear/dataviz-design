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
cinco regras de tabela que o DOM decide, e desde esta rodada `numero-sem-comparacao` (§6) e
`sem-carimbo-de-data` (§10). São 22 checagens.

**Conscientemente fora de alcance**, para não ficarem como pendência que nunca fecha:

- `jargão sem explicação` (§10): a heurística seria sigla em caixa alta sem `abbr` ou `title`. Em
  domínio técnico isso acusa vocabulário legítimo em massa (num relatório do judiciário brasileiro,
  ESAJ, TRT, CNJ e PJe são termos, não jargão opaco). O custo em falso positivo supera o ganho.
- `dead end` (§3): depende de a superfície ser relatório linear, onde não clicar é correto, ou
  analítica, onde é defeito. O probe não tem como saber qual é. O §0.3 pede essa classificação ao
  humano, e é lá que a checagem deveria morar, não no script.
- `filtro sem feedback` (§1): exige interação, fora do alcance de um probe estático.

Enquanto isso, a execução emite `nao-verificado-aqui` em toda rodada, listando o que continua sendo
julgamento humano. Isso existe porque uma execução limpa foi confundida com revisão feita.

## 3. ~~`references/render-check.md`: a tabela de checagens está desatualizada~~ FEITO

A tabela "What it decides" documentava oito checagens contra vinte no código. Sincronizada: as vinte
estão documentadas, com a regra e a fonte de cada uma, e a frase de abertura da seção deixou de
prometer só SVG. Conferido nos dois sentidos, sem divergência.

Para não voltar a divergir, vale um teste que compare os nomes em `add('...')` do script com os da
tabela do doc e falhe se um lado tiver o que o outro não tem. É o mesmo cruzamento que fiz à mão.

## 4. SKILL.md: o §11 é pulável na prática

O fluxo de revisão tem uma metade mecânica com saída objetiva (o probe) e uma metade de julgamento
(§11 a §15). Na prática a primeira sequestra a atenção e a segunda é pulada, porque uma devolve
`LIMPO` e a outra exige ler `chart-choice.md`.

Ideia: inverter a ordem na seção Usage, exigindo o §11 **antes** do render check, com uma frase
única obrigatória no formato "a relação é X, logo a forma é Y", escrita antes de qualquer medição.
Assim a escolha da forma fica registrada e revisável, em vez de implícita.

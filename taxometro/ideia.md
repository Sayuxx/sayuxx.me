# Taxômetro

Calculadora de impostos para encomendas Japão → Brasil. Mostra o **valor que vai chegar pra pagar** (produto + frete + II + ICMS + despacho dos Correios + IOF de cartão, quando aplicável) e permite comparar cenários — mesmo pacote vs. pacotes separados, EMS vs. Airmail, canal Postal Comum vs. Remessa Conforme — pra decidir o que sai mais barato antes de fechar a compra.

Pensado pra quem compra direto no Japão (proxies, lojas tipo Mercari/Yahoo Auctions/Amazon JP, vendedores via Twitter, viagens) e precisa estimar com precisão o custo total antes do produto sair de Tóquio.

## Fluxo de uso

1. **Configura o cenário fiscal** (no topo da página):
   - **Estado de destino** — define a alíquota de ICMS (17% ou 20%).
   - **Canal de importação** — *Postal Comum* (Japan Post via Correios, padrão para envios PF↔PF) ou *Remessa Conforme* (só plataformas certificadas pela RFB).
   - **Forma de pagamento** — se o produto/frete foi pago em cartão brasileiro, soma 3,5% de IOF; senão, não soma.

2. **Adiciona cada produto** com nome, categoria, preço em ¥, quantidade e peso em gramas. Mangás/livros são marcados automaticamente como imunes.

3. **Escolhe o método de frete** (EMS ou Airmail Parcel) — cada cartão mostra o custo total naquele método.

4. **Decide o agrupamento** (com 2+ produtos): "mesmo pacote" ou "pacotes separados". O app mostra a comparação automática dos dois cenários, com a diferença em verde/vermelho.

5. **Lê o detalhamento**:
   - Cada produto exibe CIF, II e ICMS individuais (rateados a partir do agregado da remessa).
   - O resumo final agrega: produtos + impostos + frete + despacho postal + IOF cartão = total a pagar.

**Princípio de design:** todo controle visível na tela tem que afetar o número final. Se algo é clicável e não muda nada, é bug.

---

# Referência fiscal — base do cálculo

> **Snapshot tributário:** abril/2026.
> Reverificar antes de qualquer atualização: PL 6.526/2025 (proposta de re-isenção até US$50), reajuste anual da tabela dos Correios, alíquotas ICMS por SEFAZ, mudanças no IOF, transição da Reforma Tributária (CBS 2027 / IBS 2029).

## 1. Cadeia de cálculo (ordem em que tudo é aplicado)

Para cada **remessa** (= 1 pacote agregado, ou N pacotes individuais conforme o toggle "mesmo pacote"):

1. **CIF da remessa em USD**: `Σ(produto.priceJPY × qty) × jpyToUsd + freteJPY × jpyToUsd`. "CIF" aqui = valor aduaneiro (mercadoria + frete; seguro postal raramente é declarado).
2. **CIF tributável**: exclui itens com imunidade categórica (livros/mangás).
3. **II aplicado uma única vez** sobre o CIF tributável da remessa:
   - `postal_common`: `0,60 × CIF tributável` (sem threshold, sem dedução).
   - `remessa_conforme` & CIF ≤ US$ 50: `0,20 × CIF tributável`.
   - `remessa_conforme` & CIF > US$ 50: `max(0, 0,60 × CIF tributável − US$ 20)`. **Os US$ 20 são desconto no imposto calculado, não na base.**
4. **ICMS "por dentro"** sobre `(CIF tributável + II)`:
   `base = (CIF + II) / (1 − icmsRate)` → `ICMS = base × icmsRate`. Alíquota 17% ou 20% pelo estado.
5. **Rateio** de II e ICMS entre produtos não-imunes da remessa, proporcional ao CIF de cada item (apenas para exibição linha-a-linha; o número agregado já está cravado).
6. **Conversão para BRL**: `jpyToBrl` (BCB) e `usdToBrl = jpyToBrl/jpyToUsd`.
7. **Despacho postal Correios**: `R$ 15 × nº de pacotes`, somente se canal = `postal_common`.
8. **IOF cartão**: `(produtosBRL + freteBRL) × 3,5%`, somente se pagamento = `br_card`.
9. **Total final** = produtos + impostos (II+ICMS) + frete + despacho + IOF cartão.

> **Por que o threshold é por remessa, não por item:** o RTS/RC define o valor aduaneiro da **declaração de importação** (= um pacote). Dois produtos de US$ 30 num só pacote viram US$ 60 → faixa alta no RC. Em pacotes separados, cada um fica em US$ 30 → faixa baixa. É o coração da comparação "mesmo pacote vs. separados".

## 2. Imposto de Importação (II)

| Canal | CIF ≤ US$ 50 | CIF > US$ 50 |
|---|---|---|
| **Postal comum** (Japan Post via Correios — padrão) | 60% flat | 60% flat |
| **Remessa Conforme** (plataforma **certificada pela RFB**) | 20% | `max(0, 0,60 × CIF − US$ 20)` |

**Ressalvas importantes:**
- A faixa de Remessa Conforme **só se aplica a plataformas certificadas** pela RFB (Portaria Coana 130/2023 + IN RFB 2.146/2023): Shein, Shopee, AliExpress, Amazon Brasil, Mercado Livre, etc. Plataforma não-certificada cai em RTS = 60% flat.
- Pessoa física no Japão enviando para PF no Brasil **nunca** é Remessa Conforme — sempre RTS 60%.
- A antiga isenção PF→PF até US$ 50 (Portaria MF 156/1999) foi **revogada pelo art. 32 da Lei 14.902/2024**, vigente desde 01/08/2024. Não vale mais.
- A "dedução de US$ 20" no RC é **subtraída do II calculado**, não do valor aduaneiro: fórmula correta `II = max(0, 0,60 × CIF − 20 USD)`.

**Boundary:** comparação `<=` em US$ 50 (faixa baixa inclusiva). Engine: [`engine.ts:42-52`](src/lib/calc/engine.ts#L42-L52).

## 3. ICMS

- Alíquota: **17% ou 20%**, definida por estado de destino (Convênio ICMS 81/2023, alterado pelo Convênio 135/2024, vigente desde 01/04/2025).
- **Estados a 20% (9):** AC, AL, BA, CE, PB, PI, RN, RR, SE.
- Demais 17 estados + DF a 17%. **MG voltou a 17%** via Decreto 49.012/2025 (havia anunciado adesão aos 20% e recuou).
- Método "por dentro": `base = (CIF + II) / (1 − rate)`. Fórmula oficial da RFB para RTS.
- ICMS **não** incide sobre despacho postal (taxa de serviço dos Correios, não tributo).
- ICMS-importação **inclui IOF na base** segundo LC 87/96, mas como IOF-câmbio aqui = 0 (ver §4), na prática soma zero.
- Tabela em [`rates.json`](src/lib/data/rates.json) (campo `icmsByState`).

## 4. IOF — duas coisas distintas, só uma se aplica aqui

- **IOF-câmbio sobre importação de bens** = **alíquota zero** (Decreto 6.306/2007, **art. 15-B, inciso I**). Mantida em vigor mesmo após a reforma do IOF de maio/2025 (Decreto 12.466/2025). Por isso o IOF **NÃO entra no CIF**.
- **IOF de cartão internacional** = **3,5% fixo** desde 22/05/2025 (Decreto 12.466/2025). O escalonamento decrescente do Decreto 10.997/2022 (4,38% → 3,88% → … → 0%) **foi extinto** e substituído por alíquota única.
- Cobrado pela **operadora do cartão** na fatura BRL, não pela Receita. Só faz sentido somar quando o consumidor pagou produto/frete em cartão brasileiro.
- Por isso o toggle de pagamento existe: o IOF só vai ao total se `paymentMethod === 'br_card'`.

## 5. Despacho Postal Correios

- **R$ 15** por pacote internacional registrado no "Minhas Importações" — valor de **fevereiro/2018**.
- Cobrado em **toda** encomenda registrada, **independente de ser tributada**.
- Reajustes anuais dos Correios em 2024 e 2025 podem ter movido o valor para algo entre **R$ 16,50 e R$ 17,50**; o app ainda usa R$ 15 conservadoramente. **Reverificar na tabela vigente dos Correios** antes de mudanças relevantes na conta. Campo: `taxes.despachoPostalBRL` em [`rates.json`](src/lib/data/rates.json).
- Só se aplica ao canal `postal_common`. **Remessa Conforme já recolhe Correios + tributos no checkout**, então fica zero.
- N pacotes = N × despacho. Custo fixo proporcional a "enviar separados".

## 6. Imunidades por categoria

| Categoria | II | ICMS | Base legal |
|---|---|---|---|
| `manga_books` | 0% | 0% | CF art. 150, VI, d (imunidade); Lei 10.753/2003 (livro inclui mangá); STF Tema 593 e ARE 1.253.322 (interpretação extensiva) |
| Demais | normal | normal | — |

**Por que só `manga_books` é imune automaticamente:**
- Livros têm **imunidade constitucional** — direito do contribuinte, não favor fiscal.
- `health` (Saúde/Suplementos) é categoria mista: medicamentos PF para uso próprio têm 0% II via MP renovada; suplementos comuns **não** são isentos. Como o app não distingue, não auto-aplica para evitar subestimar.
- Demais categorias seguem o regime padrão.

**Nuance prática:** despacho postal dos Correios **não** é imune (é taxa de serviço, não tributo). E na prática do RTS, o desembaraço aplica os 60% automaticamente — o importador pode precisar **pleitear a imunidade manualmente** no "Minhas Importações" alegando o art. 150, VI, d.

Helpers: [`engine.ts:23-31`](src/lib/calc/engine.ts#L23-L31).

## 7. CIF — composição

`CIF = valor do produto + frete internacional` (em USD).

- **Não inclui seguro** porque postal raramente declara seguro separado. Se um dia o app aceitar seguro como input, somar aqui.
- Frete é rateado por valor entre os produtos (`distributeShipping`) só para fins de exibição linha-a-linha — o cálculo do II/ICMS é feito no agregado da remessa.

## 8. Toggles — o que cada clique muda

| Toggle | Onde fica | O que muda no cálculo |
|---|---|---|
| **Estado de destino** | `StateSelector` | Alíquota ICMS 17% ↔ 20% |
| **Canal de importação** | `ImportOptions` | Fórmula do II (60% flat vs. 20%/60%−US$20) + presença do despacho postal R$ 15 |
| **Forma de pagamento** | `ImportOptions` | Liga/desliga linha "IOF cartão 3,5%" sobre produtos+frete |
| **Categoria do produto** | `ProductForm`/`ProductList` | Itens `manga_books` zeram II e ICMS (imunidade) |
| **Método de frete** (EMS/Airmail) | `ShippingEstimate` | Tabela de preço por peso muda → CIF muda → II e ICMS mudam |
| **Mesmo pacote ↔ separados** | `ShippingEstimate` (≥2 produtos) | (a) faixas de peso aplicadas em uma só ou em N tabelas; (b) threshold do RC avaliado no agregado vs. per-item; (c) despacho postal multiplica por N |
| **Quantidade do produto** | `ProductForm`/`ProductList` | Multiplica preço e peso → CIF e tier de frete |
| **Câmbio (BCB)** | `ExchangeRateBar` (refresh) | Recalcula CIF em USD/BRL e total em BRL |

## 9. O que NÃO está modelado (consciente)

- **Peso volumétrico**: Japan Post usa `max(real, volumétrico)` (~6000 cm³/kg). App usa só peso real. Subestima frete de itens leves e volumosos.
- **Seguro**: postal raramente declara. Pode entrar como input opcional.
- **Medicamento isento**: a categoria `health` é mista — adicionar campo `isMedicine` por produto seria a forma certa.
- **CBS (Reforma Tributária)**: cobrança efetiva começa em **2027** (1% inicial, escalonando até 2033). 2026 é ano-teste, PF dispensada do recolhimento (LC 214/2025).
- **IBS (Reforma Tributária)**: cobrança efetiva começa em **2029**. Transição completa até 2033.
- **Trânsito duplo Correios → courier privado** (DHL/FedEx last-mile): pode adicionar R$ 30–100 imprevisíveis. Disclamar.
- **Categorias com Imposto Seletivo** (cigarros, bebidas, etc.): regras especiais; fora do escopo.
- **Armazenagem por atraso de pagamento**: depende de comportamento do destinatário, não é estimativa de chegada.

## 10. Dados, atualização e cache

**Status atual:** todas as alíquotas e taxas fixas vivem em [`rates.json`](src/lib/data/rates.json) com um campo `lastVerified` (data da última conferência manual). O câmbio JPY→BRL e JPY→USD é o único dado **vivo** — vem do BCB em runtime via `services/bcb.ts`, com fallback para o snapshot do JSON.

**Por que a maioria está hardcoded:**
- Não existe API pública oficial para alíquotas tributárias brasileiras (Lei, Decreto, Convênio CONFAZ, Portaria MF). Mudanças saem em Diário Oficial e exigem leitura humana.
- A tabela de preços dos Correios é publicada em PDF/HTML, sem endpoint estruturado.
- Por isso "puxar em tempo real" não é tecnicamente viável sem uma fonte intermediária (scraper + serviço próprio).

**Estratégias possíveis** (em ordem crescente de esforço):

1. **Lembrete periódico** — GitHub Action mensal que abre uma issue "Reverificar `rates.json`". Zero infra, garante revisão humana.
2. **Banner de validade** — exibir `lastVerified` na UI. Se passou >90 dias, mostra aviso amarelo. Já temos o campo no JSON, falta só renderizar.
3. **Action de scraping** — workflow do GitHub Actions que faz scrape semanal de Correios (despacho postal) e Receita Federal (alíquotas vigentes), abre PR se detectar mudança. Infra zero pro deploy (ainda roda no GitHub Pages), mas exige manter os scrapers.
4. **Backend próprio** — fora do escopo de site estático. Justifica só se virar API consumida por outras pessoas.

**Recomendação atual:** combinar (1) + (2). Isso protege dos valores estagnarem silenciosamente sem migrar fora de GitHub Pages.

## 11. Fontes (verificadas em 2026-04-18)

- [Lei 14.902/2024 — "Taxa das Blusinhas"](http://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/L14902.htm) — art. 32 revogou a isenção PF→PF
- [Receita Federal — Quanto pagarei de imposto?](https://www.gov.br/receitafederal/pt-br/assuntos/aduana-e-comercio-exterior/manuais/remessas-postal-e-expressa/preciso-pagar-impostos-nas-compras-internacionais/quanto-pagarei-de-imposto)
- [Receita Federal — Programa Remessa Conforme](https://www.gov.br/receitafederal/pt-br/assuntos/aduana-e-comercio-exterior/manuais/remessas-postal-e-expressa/programa-remessa-conforme-o-que-e-como-funciona)
- [Convênio ICMS 81/2023](https://www.confaz.fazenda.gov.br/legislacao/convenios/2023/CV081_23) + Convênio ICMS 135/2024
- [Decreto 6.306/2007](http://www.planalto.gov.br/ccivil_03/_ato2007-2010/2007/decreto/d6306.htm) — art. 15-B, I (IOF-câmbio importação 0%)
- [Decreto 12.466/2025](http://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/decreto/D12466.htm) — IOF cartão 3,5% fixo
- [Constituição Federal art. 150, VI, d](http://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm) — imunidade de livros
- [Lei 10.753/2003](http://www.planalto.gov.br/ccivil_03/leis/2003/l10.753.htm) — livro inclui mangá; STF Tema 593 e ARE 1.253.322 (interpretação extensiva)
- [LC 214/2025](http://www.planalto.gov.br/ccivil_03/leis/lcp/lcp214.htm) — IBS/CBS, transição 2026–2033
- [Portaria Coana 130/2023 + IN RFB 2.146/2023](https://www.gov.br/receitafederal/pt-br/) — certificação PRC

---

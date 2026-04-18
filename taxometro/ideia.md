# Taxômetro

Calculadora de impostos para encomendas Japão → Brasil. Mostra o valor que vai chegar pra pagar (produto, frete, II, ICMS, despacho dos Correios, IOF de cartão quando aplicável) e permite comparar cenários (mesmo pacote vs. pacotes separados, EMS vs. Airmail, Postal Comum vs. Remessa Conforme) antes de fechar a compra.

Pensado pra quem compra direto no Japão via proxies, Mercari, Yahoo Auctions, Amazon JP, vendedores avulsos ou viagens, e quer estimar com precisão o custo total antes do produto sair de Tóquio.

## Fluxo de uso

1. Configura o cenário fiscal no topo da página:
   - **Estado de destino**: define a alíquota de ICMS (17% ou 20%).
   - **Canal de importação**: *Postal Comum* (Japan Post via Correios) ou *Remessa Conforme* (plataformas certificadas pela RFB).
   - **Forma de pagamento**: cartão brasileiro adiciona 3,5% de IOF; outras formas não.

2. Adiciona cada produto com nome, categoria, preço em ¥, quantidade e peso em gramas. Mangás e livros entram como imunes automaticamente.

3. Escolhe o método de frete (EMS ou Airmail Parcel). Cada cartão mostra o custo total naquele método.

4. Com 2 ou mais produtos, decide entre "mesmo pacote" ou "pacotes separados". A comparação dos dois cenários aparece automática, com a diferença em verde/vermelho.

5. Lê o detalhamento:
   - Cada produto exibe CIF, II e ICMS rateados a partir do agregado da remessa.
   - O resumo final agrega produtos, impostos, frete, despacho postal e IOF cartão no total a pagar.

---

# Referência fiscal

> **Snapshot tributário:** abril/2026.
> Reverificar antes de qualquer atualização: PL 6.526/2025 (proposta de re-isenção até US$ 50), reajuste anual da tabela dos Correios, alíquotas ICMS por SEFAZ, mudanças no IOF, transição da Reforma Tributária (CBS 2027 / IBS 2029).

## 1. Cadeia de cálculo

Para cada remessa (1 pacote agregado ou N pacotes individuais, conforme o toggle "mesmo pacote"):

1. **CIF da remessa em USD**: `Σ(produto.priceJPY × qty) × jpyToUsd + freteJPY × jpyToUsd`. CIF aqui é o valor aduaneiro (mercadoria + frete; seguro postal raramente é declarado).
2. **CIF tributável**: exclui itens com imunidade categórica (livros/mangás).
3. **II aplicado uma única vez** sobre o CIF tributável da remessa:
   - `postal_common`: `0,60 × CIF tributável`, sem threshold, sem dedução.
   - `remessa_conforme` com CIF ≤ US$ 50: `0,20 × CIF tributável`.
   - `remessa_conforme` com CIF > US$ 50: `max(0, 0,60 × CIF tributável − US$ 20)`. Os US$ 20 são desconto no imposto calculado, não na base.
4. **ICMS "por dentro"** sobre `(CIF tributável + II)`: `base = (CIF + II) / (1 − icmsRate)`, então `ICMS = base × icmsRate`. Alíquota 17% ou 20% pelo estado.
5. **Rateio** de II e ICMS entre produtos não-imunes da remessa, proporcional ao CIF de cada item, apenas para exibição linha a linha.
6. **Conversão para BRL** via `jpyToBrl` (BCB) e `usdToBrl = jpyToBrl/jpyToUsd`.
7. **Despacho postal Correios**: `R$ 15 × nº de pacotes`, apenas se canal = `postal_common`.
8. **IOF cartão**: `(produtosBRL + freteBRL) × 3,5%`, apenas se pagamento = `br_card`.
9. **Total final** = produtos + impostos (II+ICMS) + frete + despacho + IOF cartão.

O threshold de US$ 50 é avaliado por remessa, não por item. Dois produtos de US$ 30 num pacote agregado somam US$ 60 (faixa alta no RC). Em pacotes separados cada um fica em US$ 30 (faixa baixa).

## 2. Imposto de Importação (II)

| Canal | CIF ≤ US$ 50 | CIF > US$ 50 |
|---|---|---|
| **Postal comum** (Japan Post via Correios, padrão) | 60% flat | 60% flat |
| **Remessa Conforme** (plataforma certificada pela RFB) | 20% | `max(0, 0,60 × CIF − US$ 20)` |

- A faixa de Remessa Conforme só se aplica a plataformas certificadas pela RFB (Portaria Coana 130/2023 + IN RFB 2.146/2023): Shein, Shopee, AliExpress, Amazon Brasil, Mercado Livre, etc. Plataforma não-certificada cai em RTS a 60% flat.
- Pessoa física no Japão enviando para PF no Brasil nunca é Remessa Conforme, cai sempre em RTS 60%.
- A antiga isenção PF→PF até US$ 50 (Portaria MF 156/1999) foi revogada pelo art. 32 da Lei 14.902/2024, vigente desde 01/08/2024.
- A dedução de US$ 20 no RC é subtraída do II calculado, não do valor aduaneiro: `II = max(0, 0,60 × CIF − 20 USD)`.

Boundary: comparação `<=` em US$ 50 (faixa baixa inclusiva). Engine: [`engine.ts:42-52`](src/lib/calc/engine.ts#L42-L52).

## 3. ICMS

- Alíquota 17% ou 20%, definida por estado de destino (Convênio ICMS 81/2023, alterado pelo Convênio 135/2024, vigente desde 01/04/2025).
- Estados a 20%: AC, AL, BA, CE, PB, PI, RN, RR, SE.
- Demais 17 estados + DF a 17%. MG voltou a 17% via Decreto 49.012/2025.
- Método "por dentro": `base = (CIF + II) / (1 − rate)`. Fórmula oficial da RFB para RTS.
- ICMS não incide sobre despacho postal (taxa de serviço dos Correios, não tributo).
- ICMS-importação inclui IOF na base segundo LC 87/96, mas como IOF-câmbio aqui é 0 (ver §4), na prática soma zero.
- Tabela em [`rates.json`](src/lib/data/rates.json), campo `icmsByState`.

## 4. IOF

- **IOF-câmbio sobre importação de bens**: alíquota zero (Decreto 6.306/2007, art. 15-B, inciso I). Mantida mesmo após a reforma do IOF de maio/2025 (Decreto 12.466/2025). Não entra no CIF.
- **IOF de cartão internacional**: 3,5% fixo desde 22/05/2025 (Decreto 12.466/2025). O escalonamento decrescente do Decreto 10.997/2022 foi extinto. Cobrado pela operadora do cartão na fatura BRL, não pela Receita.
- O toggle de pagamento só soma IOF ao total quando `paymentMethod === 'br_card'`.

## 5. Despacho Postal Correios

- R$ 15 por pacote internacional registrado no "Minhas Importações", valor de fevereiro/2018.
- Cobrado em toda encomenda registrada, tributada ou não.
- Reajustes de 2024 e 2025 podem ter movido o valor para R$ 16,50 ou R$ 17,50. O app ainda usa R$ 15 conservadoramente. Campo `taxes.despachoPostalBRL` em [`rates.json`](src/lib/data/rates.json).
- Só se aplica ao canal `postal_common`. Em Remessa Conforme o valor já é recolhido no checkout.
- N pacotes = N × despacho.

## 6. Imunidades por categoria

| Categoria | II | ICMS | Base legal |
|---|---|---|---|
| `manga_books` | 0% | 0% | CF art. 150, VI, d (imunidade); Lei 10.753/2003 (livro inclui mangá); STF Tema 593 e ARE 1.253.322 (interpretação extensiva) |
| Demais | normal | normal | |

- `health` é categoria mista: medicamentos PF para uso próprio têm 0% II via MP renovada; suplementos comuns não são isentos. O app não distingue, então a imunidade não é aplicada automaticamente.
- Despacho postal dos Correios não é imune (taxa de serviço).
- Na prática do RTS, o desembaraço aplica os 60% automaticamente. O importador pode precisar pleitear a imunidade manualmente no "Minhas Importações" alegando o art. 150, VI, d.

Helpers: [`engine.ts:23-31`](src/lib/calc/engine.ts#L23-L31).

## 7. CIF

`CIF = valor do produto + frete internacional` (em USD).

- Não inclui seguro. Postal raramente declara seguro separado.
- Frete é rateado por valor entre os produtos (`distributeShipping`) para exibição linha a linha. O cálculo do II/ICMS é feito no agregado da remessa.

## 8. Toggles

| Toggle | Onde fica | O que muda no cálculo |
|---|---|---|
| Estado de destino | `StateSelector` | Alíquota ICMS 17% ou 20% |
| Canal de importação | `ImportOptions` | Fórmula do II (60% flat vs. 20% ou 60%−US$ 20) + presença do despacho postal R$ 15 |
| Forma de pagamento | `ImportOptions` | Liga/desliga linha "IOF cartão 3,5%" sobre produtos + frete |
| Categoria do produto | `ProductForm`/`ProductList` | Itens `manga_books` zeram II e ICMS (imunidade) |
| Método de frete (EMS/Airmail) | `ShippingEstimate` | Tabela de preço por peso muda, CIF muda, II e ICMS mudam |
| Mesmo pacote ou separados | `ShippingEstimate` (≥2 produtos) | (a) faixas de peso aplicadas em uma só ou em N tabelas; (b) threshold do RC avaliado no agregado vs. per-item; (c) despacho postal multiplica por N |
| Quantidade do produto | `ProductForm`/`ProductList` | Multiplica preço e peso, afeta CIF e tier de frete |
| Câmbio (BCB) | `ExchangeRateBar` (refresh) | Recalcula CIF em USD/BRL e total em BRL |

Todo controle visível na tela afeta o número final.

## 9. Não modelado

- **Peso volumétrico**: Japan Post usa `max(real, volumétrico)` (~6000 cm³/kg). App usa só peso real.
- **Seguro**: postal raramente declara.
- **Medicamento isento**: categoria `health` é mista, não auto-aplica.
- **CBS (Reforma Tributária)**: cobrança efetiva começa em 2027 (1% inicial, escalonando até 2033). 2026 é ano-teste, PF dispensada do recolhimento (LC 214/2025).
- **IBS (Reforma Tributária)**: cobrança efetiva começa em 2029. Transição completa até 2033.
- **Trânsito duplo Correios → courier privado** (DHL/FedEx last-mile): pode adicionar R$ 30 a R$ 100.
- **Categorias com Imposto Seletivo** (cigarros, bebidas): regras especiais, fora do escopo.
- **Armazenagem por atraso de pagamento**: depende de comportamento do destinatário.

## 10. Dados e atualização

**Câmbio** vem do PTAX do BCB.
- Em runtime, `services/bcb.ts` busca no navegador quando o usuário abre a página. É esse valor que aparece na tela.
- Em build-time, o workflow [`refresh-rates.yml`](.github/workflows/refresh-rates.yml) roda 1×/dia às 17:30 UTC (~14:30 BRT) e atualiza o snapshot de `rates.json` como fallback. Quando commita, dispara `deploy.yml` via `workflow_dispatch`.
- Script: [`taxometro/scripts/refresh-rates.mjs`](scripts/refresh-rates.mjs). Rodar local com `node scripts/refresh-rates.mjs` ou disparar manualmente via `workflow_dispatch` no GitHub.

**Tributos** ficam congelados em [`rates.json`](src/lib/data/rates.json) com campo `lastVerified`. Não existe API pública para alíquotas; mudam por Lei, Decreto, Convênio CONFAZ ou Portaria MF.
- Workflow [`check-stale-rates.yml`](.github/workflows/check-stale-rates.yml) roda diariamente: se `lastVerified` > 30 dias, abre issue `rates-stale` com checklist de fontes. Não duplica se já tem issue aberta.
- A UI mostra a data de verificação no rodapé, em amarelo quando passa dos 30 dias.

## 11. Fontes

- [Lei 14.902/2024 ("Taxa das Blusinhas")](http://www.planalto.gov.br/ccivil_03/_ato2023-2026/2024/lei/L14902.htm), art. 32 revogou a isenção PF→PF
- [Receita Federal: Quanto pagarei de imposto?](https://www.gov.br/receitafederal/pt-br/assuntos/aduana-e-comercio-exterior/manuais/remessas-postal-e-expressa/preciso-pagar-impostos-nas-compras-internacionais/quanto-pagarei-de-imposto)
- [Receita Federal: Programa Remessa Conforme](https://www.gov.br/receitafederal/pt-br/assuntos/aduana-e-comercio-exterior/manuais/remessas-postal-e-expressa/programa-remessa-conforme-o-que-e-como-funciona)
- [Convênio ICMS 81/2023](https://www.confaz.fazenda.gov.br/legislacao/convenios/2023/CV081_23) + Convênio ICMS 135/2024
- [Decreto 6.306/2007](http://www.planalto.gov.br/ccivil_03/_ato2007-2010/2007/decreto/d6306.htm), art. 15-B, I (IOF-câmbio importação 0%)
- [Decreto 12.466/2025](http://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/decreto/D12466.htm), IOF cartão 3,5% fixo
- [Constituição Federal art. 150, VI, d](http://www.planalto.gov.br/ccivil_03/constituicao/constituicaocompilado.htm), imunidade de livros
- [Lei 10.753/2003](http://www.planalto.gov.br/ccivil_03/leis/2003/l10.753.htm) (livro inclui mangá); STF Tema 593 e ARE 1.253.322 (interpretação extensiva)
- [LC 214/2025](http://www.planalto.gov.br/ccivil_03/leis/lcp/lcp214.htm), IBS/CBS, transição 2026 a 2033
- [Portaria Coana 130/2023 + IN RFB 2.146/2023](https://www.gov.br/receitafederal/pt-br/), certificação PRC

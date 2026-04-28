# 🇯🇵 Japan Travel Matcher — Prompt para Claude Code

## Visão Geral do Projeto
Crie um site completo de recomendação de viagem para o Japão, com quiz de personalidade e gerador de roteiro. O site deve ser 100% estático, sem backend, sem APIs pagas e sem consumo de tokens de IA. Toda a lógica de personalização e geração de roteiro deve ser feita com JavaScript puro, usando dados pré-definidos.

---

## Stack Técnica
- React + Vite (ou Next.js estático)
- CSS Modules ou Tailwind CSS
- JavaScript puro para lógica de matching e geração de roteiros
- Sem banco de dados, sem autenticação, sem APIs pagas
- Deploy gratuito via Vercel ou Netlify

---

## Identidade Visual

### Paleta de Cores
```
--color-sage:    #7e9695  → cor primária, fundos, elementos calmos
--color-red:     #ba474a  → destaques, CTAs, elementos de energia
--color-cream:   #eeedd7  → fundo principal, textos sobre escuro
--color-navy:    #252a38  → textos, headers, elementos de ancora
```

### Tipografia
- **Satoshi** (Google Fonts / Fontshare) → textos corridos, UI geral
- **Shippori Mincho** (Google Fonts) → títulos, elementos decorativos, citações — traz a vibe japonesa refinada e serifada
- Usar caracteres japoneses decorativos (kanji) como elementos visuais em títulos e seções

### Elementos Culturais Japoneses a Incorporar
- Padrões geométricos tradicionais: seigaiha (escamas), asanoha (cânhamo), shippo (círculos sobrepostos) — implementar em CSS ou SVG como backgrounds e divisores
- Linhas finas e composição com muito espaço negativo (estética wabi-sabi)
- Torii gate como elemento de navegação ou hero
- Ondas de Hokusai como textura decorativa em SVG
- Sakura (pétalas de cerejeira) em animação CSS sutil na tela de resultado
- Kanji como overlays decorativos semitransparentes (旅, 日本, 和, 道)
- Bordas com estética "washi" (papel japonês) — bordas irregulares suaves

---

## Estrutura de Páginas

### 1. Landing Page (/)
- Hero tela cheia com kanji 旅 (viagem) gigante como elemento de fundo semitransparente
- Tagline em Satoshi + subtítulo em Shippori Mincho
- CTA "Descubra seu Japão" em --color-red
- Seção breve explicando o que o site faz
- Animação de entrada com stagger (elementos aparecem sequencialmente)
- Background: --color-cream com padrão seigaiha muito sutil em --color-sage com 8% de opacidade

### 2. Quiz de Personalidade (/quiz)
- 8 a 10 perguntas com múltipla escolha (cartões visuais clicáveis, não radio buttons)
- Barra de progresso estilo japonês (torii particionado ou linha com ponto deslizante)
- Cada pergunta tem ícone ou ilustração minimalista
- Transições suaves entre perguntas (slide ou fade)
- Perguntas sugeridas (crie outras que complementem):
  1. Qual ritmo de viagem te representa? (Intenso e cheio / Calmo e contemplativo / Equilibrado)
  2. O que mais te atrai no Japão? (Natureza / Tecnologia e modernidade / Cultura e tradição / Gastronomia / Anime e pop culture)
  3. Que tipo de acomodação prefere? (Ryokan tradicional / Hotel moderno / Hostel e socialização / Cápsula minimalista)
  4. Qual época do ano você viajaria? (Primavera - sakura / Verão - festivais / Outono - momiji / Inverno - neve)
  5. Como você se sente em multidões? (Amo a energia / Prefiro evitar / Depende do contexto)
  6. Sua relação com comida é: (Aventureiro total / Prefiro o conhecido / Quero experimentar mas com cuidado)
  7. Você prefere: (Cidades grandes e vibrantes / Cidades pequenas e charmosas / Natureza e interior)
  8. Orçamento diário estimado: (Econômico / Moderado / Confortável / Premium)

### 3. Página de Resultado (/resultado)
- Animação de "revelação" do perfil do viajante (ex: "O Explorador Contemplativo", "O Mergulhador Cultural", "O Caçador Urbano", etc. — crie 6 a 8 personas)
- Cada persona tem: nome em português + nome em japonês + kanji representativo + descrição + ícone
- Seção "Seus Destinos Ideais" — cards de 3 a 5 cidades/regiões recomendadas com base no matching
- Cada destino card tem: foto (usar Unsplash URL estático), nome, nome em japonês, por que combina com você, pontos de interesse principais, melhor época, custo estimado
- Animação de sakura flutuando no fundo (CSS puro, pétalas SVG simples)
- CTA principal: "Gerar Roteiro Completo" → abre modal ou vai para /roteiro

### 4. Página de Roteiro (/roteiro)
- Roteiro dia a dia gerado algoritmicamente (JavaScript puro, sem IA)
- Perguntar: quantos dias de viagem? (7 / 10 / 14 / 21 dias)
- Exibir roteiro com: Dia X → Cidade → Lista de atividades ordenadas por horário → Onde comer → Dica do dia
- Cada dia tem um "tema" visual e kanji representativo
- Botão "Exportar como PDF" (usar jsPDF ou print CSS otimizado)
- Botão "Copiar Roteiro" (copy to clipboard)
- Botão "Compartilhar" (Web Share API)
- Layout estilo "caderno de viagem" com linhas sutis e manchas de aquarela em SVG

---

## Lógica de Matching (JavaScript puro)

### Sistema de Pontuação
```javascript
// Cada resposta incrementa pontos em categorias
const categories = {
  natureza: 0,
  cultura: 0,
  modernidade: 0,
  gastronomia: 0,
  aventura: 0,
  tranquilidade: 0,
  budget: 'moderado' // econômico | moderado | confortável | premium
}

// Mapeamento de respostas → pontos por categoria
// Ao final, calcular scores e fazer matching com destinos e personas
```

### Destinos Pré-definidos (mínimo 15 destinos)
Criar objetos JavaScript completos para pelo menos:
- Kyoto, Tokyo, Osaka, Nara, Hiroshima, Hakone, Nikko, Kanazawa,
- Takayama, Miyajima, Okinawa, Sapporo, Sendai, Kamakura, Beppu

Cada destino deve ter:
```javascript
{
  id: 'kyoto',
  nome: 'Kyoto',
  nomejp: '京都',
  kanji: '京',
  descricao: '...',
  categorias: { natureza: 7, cultura: 10, modernidade: 3, ... },
  melhorEpoca: ['spring', 'autumn'],
  custoDiario: 'moderado',
  pontosPrincipais: [...],
  dicaLocal: '...',
  unsplashId: '...' // ID de foto do Unsplash
}
```

### Geração de Roteiro Algorítmica
```javascript
// Função pura que recebe: { destinos: [], dias: number, perfil: {} }
// Retorna: array de objetos { dia, cidade, manha, tarde, noite, restaurante, dica }
// Distribuir dias entre destinos com base no score de compatibilidade
// Considerar tempo de deslocamento entre cidades
// Incluir dias de viagem/transporte
// Usar shinkansen como principal modal entre cidades distantes
```

---

## Dados de Atividades
Criar banco de dados estático em JSON ou JS com pelo menos 10 atividades por destino principal, categorizadas por:
- tipo: cultural | natureza | gastronomia | moderno | relaxamento | compras
- duração: horas estimadas
- custo: gratuito | baixo | médio | alto
- melhorHorario: manhã | tarde | noite
- descrição curta e descrição longa
- dica especial
- endereço aproximado

---

## Componentes de UI a Criar

1. **QuizCard** — cartão clicável com ícone, texto e estado selecionado
2. **ProgressBar** — barra de progresso japonesa estilizada
3. **PersonaReveal** — animação de revelação do perfil
4. **DestinoCard** — card de destino com foto, info e score de compatibilidade
5. **RoteiroDia** — bloco de um dia do roteiro com timeline visual
6. **FloatingPetals** — animação CSS de pétalas de sakura (sem biblioteca)
7. **KanjiDecoration** — componente de kanji decorativo semitransparente
8. **PatternBackground** — padrões geométricos japoneses em SVG/CSS

---

## Animações e Motion

- Entrada da landing: fade + slide up com stagger de 150ms por elemento
- Transição entre perguntas do quiz: slide horizontal suave (300ms ease)
- Revelação do perfil: scale up + fade com delay dramático (800ms)
- Cards de destino: aparecem em cascata com delay incremental
- Pétalas de sakura: animação CSS infinita, caminho aleatório via CSS custom properties
- Hover nos cards: lift sutil com sombra e borda em --color-red
- CTA buttons: background fill animation no hover

---

## Responsividade
- Mobile-first
- Breakpoints: 375px, 768px, 1024px, 1440px
- Quiz em tela cheia no mobile
- Cards de destino: 1 coluna mobile, 2 tablet, 3 desktop
- Roteiro: coluna única mobile, dois painéis desktop (índice + conteúdo)

---

## Performance e Acessibilidade
- Lazy load das imagens (Unsplash com parâmetros de tamanho)
- Skeleton loading para cards de destino
- aria-labels em todos os elementos interativos
- Navegação por teclado no quiz
- Prefers-reduced-motion respeitado nas animações
- Fontes com font-display: swap

---

## Arquitetura de Arquivos Sugerida
```
src/
├── components/
│   ├── ui/           # componentes genéricos
│   ├── quiz/         # componentes do quiz
│   ├── resultado/    # componentes de resultado
│   └── roteiro/      # componentes do roteiro
├── data/
│   ├── destinos.js   # dados de todos os destinos
│   ├── atividades.js # banco de atividades por destino
│   ├── personas.js   # perfis de viajante
│   └── matching.js   # lógica de pontuação e matching
├── hooks/
│   ├── useQuiz.js    # estado e lógica do quiz
│   └── useRoteiro.js # geração de roteiro
├── pages/            # ou app/ se Next.js
└── styles/
    ├── globals.css   # variáveis, reset, tipografia
    └── patterns.css  # padrões japoneses em CSS/SVG
```

---

## Entregável Final
Um site completo, deployável, bonito e funcional que:
- Guia o usuário pelo quiz com UX fluida
- Gera recomendações personalizadas sem nenhuma chamada de API paga
- Cria roteiros completos e exportáveis algoritmicamente
- Tem identidade visual japonesa refinada e memorável
- Funciona 100% offline após o primeiro carregamento
- É gratuito para hospedar (github pages)

Começe criando a estrutura do projeto, os dados estáticos e a lógica de matching. Depois construa as páginas em ordem: Landing → Quiz → Resultado → Roteiro.
```

---
import type { Atividade } from '../types';

export const ATIVIDADES: Atividade[] = [
	// === Kyoto ===
	{
		id: 'kyoto-fushimi',
		destinoId: 'kyoto',
		nome: 'Fushimi Inari Taisha',
		tipo: 'cultural',
		duracao: 2.5,
		custo: 'gratuito',
		melhorHorario: 'manha',
		descricao: 'Subida pelos milhares de torii vermelhos no monte Inari. A trilha completa leva ~2h ida-e-volta.',
		dica: 'Antes das 7h o caminho está vazio e nebuloso. Vale o despertador.'
	},
	{
		id: 'kyoto-arashiyama',
		destinoId: 'kyoto',
		nome: 'Floresta de Bambu de Arashiyama',
		tipo: 'natureza',
		duracao: 1.5,
		custo: 'gratuito',
		melhorHorario: 'manha',
		descricao: 'Caminho curto entre bambus gigantes que filtram a luz. Templo Tenryu-ji ali do lado.',
		dica: 'Combina bem com Fushimi no mesmo dia se acordar cedo.'
	},
	{
		id: 'kyoto-gion',
		destinoId: 'kyoto',
		nome: 'Bairro de Gion ao entardecer',
		tipo: 'cultural',
		duracao: 2,
		custo: 'gratuito',
		melhorHorario: 'noite',
		descricao: 'Ruas de pedra, casas de chá e a chance (rara) de avistar uma maiko a caminho do trabalho.',
		dica: 'Não fotografe gueixas — a regra local é estrita e há multas.'
	},
	{
		id: 'kyoto-nishiki',
		destinoId: 'kyoto',
		nome: 'Mercado Nishiki',
		tipo: 'gastronomia',
		duracao: 1.5,
		custo: 'baixo',
		melhorHorario: 'tarde',
		descricao: 'Rua coberta com 100+ barracas de tsukemono, sashimi, dashi, doces tradicionais.',
		dica: 'Coma andando é mal-visto — pare na barraca, prove ali, devolva o palito.'
	},
	{
		id: 'kyoto-kiyomizu',
		destinoId: 'kyoto',
		nome: 'Kiyomizu-dera + Higashiyama',
		tipo: 'cultural',
		duracao: 3,
		custo: 'baixo',
		melhorHorario: 'tarde',
		descricao: 'Templo na encosta com varanda suspensa e vista pra cidade inteira. Subida pelas ladeiras de Sannenzaka e Ninenzaka.',
		dica: 'Vá no fim de tarde — a luz dourada na varanda é cinematográfica.'
	},

	// === Tokyo ===
	{
		id: 'tokyo-shibuya',
		destinoId: 'tokyo',
		nome: 'Shibuya Crossing + Hachiko',
		tipo: 'moderno',
		duracao: 2,
		custo: 'gratuito',
		melhorHorario: 'noite',
		descricao: 'A travessia mais famosa do mundo, melhor vista do Starbucks no 2º andar do Tsutaya.',
		dica: 'À noite o neon completo do cruzamento liga; na frente do Shibuya Sky tem ângulo absurdo.'
	},
	{
		id: 'tokyo-senso',
		destinoId: 'tokyo',
		nome: 'Senso-ji + Asakusa',
		tipo: 'cultural',
		duracao: 2.5,
		custo: 'gratuito',
		melhorHorario: 'manha',
		descricao: 'Templo budista mais antigo de Tokyo. Rua Nakamise leva ao portão Kaminarimon com lanterna gigante.',
		dica: 'Vá cedo — depois das 10h vira mar de turistas. Tente experimentar ningyo-yaki na Nakamise.'
	},
	{
		id: 'tokyo-teamlab',
		destinoId: 'tokyo',
		nome: 'TeamLab Planets',
		tipo: 'moderno',
		duracao: 2,
		custo: 'medio',
		melhorHorario: 'tarde',
		descricao: 'Museu imersivo de arte digital — você pisa na água, em jardins de orquídeas, atravessa salas de luz infinita.',
		dica: 'Compre ingresso com 2-3 semanas de antecedência. Use shorts ou calça enrolável (vai molhar até o joelho).'
	},
	{
		id: 'tokyo-toyosu',
		destinoId: 'tokyo',
		nome: 'Mercado de Toyosu (peixe)',
		tipo: 'gastronomia',
		duracao: 2.5,
		custo: 'medio',
		melhorHorario: 'manha',
		descricao: 'Sucessor do Tsukiji. Leilão de atum madrugada e dezenas de balcões de sushi premium no térreo.',
		dica: 'Sushi Dai e Daiwa Sushi têm fila de 1-2h às 5h da manhã. Vale.'
	},
	{
		id: 'tokyo-shimokita',
		destinoId: 'tokyo',
		nome: 'Shimokitazawa',
		tipo: 'compras',
		duracao: 3,
		custo: 'baixo',
		melhorHorario: 'tarde',
		descricao: 'Bairro de vintage shops, sebos, cafés alternativos. O lado descolado e analógico de Tokyo.',
		dica: 'Comece pela New York Joe Exchange e termine num kissaten (cafeteria à moda antiga).'
	},

	// === Osaka ===
	{
		id: 'osaka-dotonbori',
		destinoId: 'osaka',
		nome: 'Dotonbori (noite)',
		tipo: 'gastronomia',
		duracao: 3,
		custo: 'baixo',
		melhorHorario: 'noite',
		descricao: 'Rua-canal com letreiros gigantes (Glico, caranguejo mecânico), takoyaki em cada esquina, vida noturna intensa.',
		dica: 'Pule o jantar grande e coma 4-5 coisinhas — takoyaki, kushikatsu, okonomiyaki, kani.'
	},
	{
		id: 'osaka-castelo',
		destinoId: 'osaka',
		nome: 'Castelo de Osaka',
		tipo: 'cultural',
		duracao: 2,
		custo: 'baixo',
		melhorHorario: 'tarde',
		descricao: 'Castelo reconstruído com museu interno sobre o unificador Hideyoshi. Parque enorme ao redor.',
		dica: 'A subida ao topo dá vista 360º. Em primavera o parque é um dos melhores hanami da cidade.'
	},
	{
		id: 'osaka-kuromon',
		destinoId: 'osaka',
		nome: 'Mercado Kuromon Ichiba',
		tipo: 'gastronomia',
		duracao: 1.5,
		custo: 'medio',
		melhorHorario: 'manha',
		descricao: 'Rua coberta com 150+ barracas. Vieira na chapa, atum cortado na hora, melão Yubari por R$200.',
		dica: 'Almoço-degustação: 6-7 paradas. Não tente comer sentado, é tudo de pé na barraca.'
	},
	{
		id: 'osaka-shinsekai',
		destinoId: 'osaka',
		nome: 'Shinsekai + Tsutenkaku',
		tipo: 'cultural',
		duracao: 2,
		custo: 'baixo',
		melhorHorario: 'tarde',
		descricao: 'Bairro retrô anos 60 que parecia ser o futuro. Torre Tsutenkaku como referência, kushikatsu como religião.',
		dica: 'Daruma é a casa de kushikatsu mais antiga. Regra absoluta: nunca molhe duas vezes no molho compartilhado.'
	},
	{
		id: 'osaka-universal',
		destinoId: 'osaka',
		nome: 'Universal Studios Japan',
		tipo: 'moderno',
		duracao: 9,
		custo: 'alto',
		melhorHorario: 'manha',
		descricao: 'Parque com Super Nintendo World, Harry Potter Land e atrações exclusivas do Japão.',
		dica: 'Compre Express Pass online. Sem ele, fila do Mario Kart bate 3h.'
	},

	// === Hakone ===
	{
		id: 'hakone-onsen',
		destinoId: 'hakone',
		nome: 'Banho em onsen tradicional',
		tipo: 'relaxamento',
		duracao: 2,
		custo: 'medio',
		melhorHorario: 'noite',
		descricao: 'Banho em águas termais sulfurosas, idealmente num ryokan. Tatuagem ainda é problema em muitos — pesquise antes.',
		dica: 'Tenzan e Yunessun aceitam day-trippers. Tenzan é mais tradicional, Yunessun é parque temático.'
	},
	{
		id: 'hakone-lago',
		destinoId: 'hakone',
		nome: 'Lago Ashi (barco pirata)',
		tipo: 'natureza',
		duracao: 2,
		custo: 'medio',
		melhorHorario: 'tarde',
		descricao: 'Travessia de "barco pirata" pelo lago vulcânico com vista do Fuji em dias claros.',
		dica: 'Olhe a previsão de "Mt Fuji visibility" — o monte só aparece em ~30% dos dias.'
	},
	{
		id: 'hakone-museu',
		destinoId: 'hakone',
		nome: 'Hakone Open-Air Museum',
		tipo: 'cultural',
		duracao: 2.5,
		custo: 'medio',
		melhorHorario: 'manha',
		descricao: 'Museu ao ar livre com esculturas de Moore, Rodin e ala dedicada ao Picasso, espalhadas pelo verde.',
		dica: 'Tem footbath gratuito alimentado por água termal — descanso perfeito no meio do tour.'
	},
	{
		id: 'hakone-owakudani',
		destinoId: 'hakone',
		nome: 'Owakudani (vapor sulfúrico)',
		tipo: 'natureza',
		duracao: 1.5,
		custo: 'baixo',
		melhorHorario: 'tarde',
		descricao: 'Vale vulcânico ativo, fumarolas amarelas. Tradição: comer "kurotamago" (ovo cozido na água termal, casca preta).',
		dica: 'Um ovo preto adiciona 7 anos de vida segundo a lenda. Ninguém te impede de comer 5.'
	},
	{
		id: 'hakone-pass',
		destinoId: 'hakone',
		nome: 'Circuito Hakone Free Pass',
		tipo: 'natureza',
		duracao: 8,
		custo: 'medio',
		melhorHorario: 'manha',
		descricao: 'Loop completo: trem panorâmico → funicular → teleférico → barco → ônibus. Cobre toda a região num dia.',
		dica: 'Pegue o pass em Shinjuku. Cobre transporte ida-volta de Tokyo + tudo dentro do circuito.'
	},

	// === Nara ===
	{
		id: 'nara-todaiji',
		destinoId: 'nara',
		nome: 'Todai-ji (Grande Buda)',
		tipo: 'cultural',
		duracao: 2,
		custo: 'baixo',
		melhorHorario: 'manha',
		descricao: 'Templo com Daibutsu de bronze de 15m de altura, dentro de uma das maiores estruturas de madeira do mundo.',
		dica: 'Há um pilar com furo do tamanho da narina do Buda. Quem passa por ele "encontra a iluminação". Crianças passam fácil.'
	},
	{
		id: 'nara-cervos',
		destinoId: 'nara',
		nome: 'Parque de Nara (cervos sagrados)',
		tipo: 'natureza',
		duracao: 2,
		custo: 'gratuito',
		melhorHorario: 'tarde',
		descricao: 'Mil e duzentos cervos shika andam livres pelo parque. Eles fazem reverência por shika senbei (biscoito).',
		dica: 'Os cervos fazem reverência mesmo. Mas se você demora pra dar o biscoito, eles mordem a roupa.'
	},
	{
		id: 'nara-kasuga',
		destinoId: 'nara',
		nome: 'Kasuga Taisha (lanternas)',
		tipo: 'cultural',
		duracao: 1.5,
		custo: 'baixo',
		melhorHorario: 'tarde',
		descricao: 'Santuário xintoísta com 3.000 lanternas de pedra e bronze. As de bronze acendem só duas vezes por ano.',
		dica: 'Caminhe pela trilha de cedros que leva até lá — o caminho é tão bonito quanto o destino.'
	},
	{
		id: 'nara-naramachi',
		destinoId: 'nara',
		nome: 'Naramachi (cidade antiga)',
		tipo: 'cultural',
		duracao: 2,
		custo: 'baixo',
		melhorHorario: 'tarde',
		descricao: 'Bairro Edo preservado, com casas-machiya viradas em cafés, lojas de artesanato e museus pequenos.',
		dica: 'Mochi-tsuki na frente da Nakatanidou — o batedor é tão rápido que parece truque de feira.'
	},
	{
		id: 'nara-wakakusa',
		destinoId: 'nara',
		nome: 'Subida do Mt. Wakakusa',
		tipo: 'natureza',
		duracao: 2.5,
		custo: 'gratuito',
		melhorHorario: 'tarde',
		descricao: 'Colina nua sobre Nara, vista panorâmica com cervos pastando aos seus pés.',
		dica: 'Suba pro pôr-do-sol. Em janeiro a colina inteira é queimada num festival anual (Yamayaki).'
	},

	// === Kanazawa ===
	{
		id: 'kanazawa-kenrokuen',
		destinoId: 'kanazawa',
		nome: 'Jardim Kenroku-en',
		tipo: 'natureza',
		duracao: 2,
		custo: 'baixo',
		melhorHorario: 'manha',
		descricao: 'Um dos três jardins mais famosos do Japão. Combina os "seis atributos" do jardim perfeito da estética chinesa.',
		dica: 'No inverno, os pinheiros recebem yukitsuri (cordas pra evitar quebra com peso da neve) — é uma das imagens mais icônicas.'
	},
	{
		id: 'kanazawa-higashi',
		destinoId: 'kanazawa',
		nome: 'Bairro Higashi Chaya',
		tipo: 'cultural',
		duracao: 2,
		custo: 'baixo',
		melhorHorario: 'tarde',
		descricao: 'Distrito de gueixas preservado: casas de chá de fachada de madeira, ouro folheado em tudo, ruas estreitas.',
		dica: 'Na Hakuza você toma matcha em xícara folheada a ouro. Cara e turístico, sim — também singular.'
	},
	{
		id: 'kanazawa-omicho',
		destinoId: 'kanazawa',
		nome: 'Mercado Omicho',
		tipo: 'gastronomia',
		duracao: 1.5,
		custo: 'medio',
		melhorHorario: 'manha',
		descricao: 'Mercado coberto de 300 anos. Caranguejo de neve em temporada, sashimi fresco do Mar do Japão, ouriço gigante.',
		dica: 'Suba ao 2º andar pra um kaisen-don (tigela de sashimi misto) sem dó.'
	},
	{
		id: 'kanazawa-21st',
		destinoId: 'kanazawa',
		nome: '21st Century Museum of Contemporary Art',
		tipo: 'moderno',
		duracao: 2,
		custo: 'baixo',
		melhorHorario: 'tarde',
		descricao: 'Museu redondo com paredes de vidro. Inclui a famosa "Piscina" do Leandro Erlich onde você pode estar dentro e fora ao mesmo tempo.',
		dica: 'Compre o ingresso da exposição da Piscina específica (separado do museu) — fila vale.'
	},
	{
		id: 'kanazawa-castelo',
		destinoId: 'kanazawa',
		nome: 'Castelo de Kanazawa + Gyokusen-en',
		tipo: 'cultural',
		duracao: 2,
		custo: 'gratuito',
		melhorHorario: 'manha',
		descricao: 'Castelo reconstruído ao lado do Kenroku-en — os dois eram um único complexo no período Edo.',
		dica: 'O Gyokusen-en é um jardinzinho secreto que muito turista pula. Mais bonito que o castelo em si.'
	},

	// === Hiroshima ===
	{
		id: 'hiroshima-memorial',
		destinoId: 'hiroshima',
		nome: 'Parque Memorial da Paz',
		tipo: 'cultural',
		duracao: 3,
		custo: 'baixo',
		melhorHorario: 'manha',
		descricao: 'Cúpula da Bomba, museu, monumento à Sadako (mil tsurus). Uma das visitas mais pesadas e necessárias do Japão.',
		dica: 'Reserve manhã inteira. O museu é denso e emocional — não tente combinar com nada empolgante depois.'
	},
	{
		id: 'hiroshima-castelo',
		destinoId: 'hiroshima',
		nome: 'Castelo de Hiroshima',
		tipo: 'cultural',
		duracao: 1.5,
		custo: 'baixo',
		melhorHorario: 'tarde',
		descricao: 'Reconstruído no pós-guerra, é o "Castelo Carpa" — apelido pelo fosso cheio. Museu samurai dentro.',
		dica: 'Aluga-se kimono na entrada por uma hora — barato e os jardins ficam mais fotogênicos.'
	},
	{
		id: 'hiroshima-shukkei',
		destinoId: 'hiroshima',
		nome: 'Jardim Shukkei-en',
		tipo: 'natureza',
		duracao: 1.5,
		custo: 'baixo',
		melhorHorario: 'tarde',
		descricao: 'Jardim "paisagem condensada" — replica em miniatura cenas de West Lake (China) num espaço pequeno.',
		dica: 'Tem casa de chá no centro. Pare por matcha + wagashi entre os dois templos do dia.'
	},
	{
		id: 'hiroshima-okonomi',
		destinoId: 'hiroshima',
		nome: 'Okonomi-mura',
		tipo: 'gastronomia',
		duracao: 2,
		custo: 'medio',
		melhorHorario: 'noite',
		descricao: 'Prédio inteiro só de okonomiyaki estilo Hiroshima — camada de macarrão soba grelhada por cima da panqueca.',
		dica: 'Sente no balcão e veja o cozinheiro montar na chapa. Cada andar tem 8-10 barracas — escolha pela vibe.'
	},
	{
		id: 'hiroshima-shimanami',
		destinoId: 'hiroshima',
		nome: 'Shimanami Kaido (bicicleta)',
		tipo: 'natureza',
		duracao: 8,
		custo: 'medio',
		melhorHorario: 'manha',
		descricao: 'Ciclovia de 70km que cruza 6 ilhas do Mar Interior em pontes suspensas. Day-trip ambicioso de bicicleta.',
		dica: 'Aluga-se bike numa ponta e devolve na outra. Pra quem não pedala 70km, faça as 2 primeiras pontes e pegue ônibus.'
	},

	// === Nikko ===
	{
		id: 'nikko-toshogu',
		destinoId: 'nikko',
		nome: 'Tosho-gu',
		tipo: 'cultural',
		duracao: 3,
		custo: 'medio',
		melhorHorario: 'manha',
		descricao: 'Mausoléu do shogun Tokugawa Ieyasu. O santuário mais ornamentado do Japão — barroco oriental literal.',
		dica: 'Os 3 macacos sábios ("não vejo, não ouço, não falo") estão num estábulo lateral. Quase ninguém repara.'
	},
	{
		id: 'nikko-kegon',
		destinoId: 'nikko',
		nome: 'Cataratas de Kegon',
		tipo: 'natureza',
		duracao: 2,
		custo: 'baixo',
		melhorHorario: 'tarde',
		descricao: 'Queda de 97m vinda direto do Lago Chuzenji. Elevador desce até a base pra observação frontal.',
		dica: 'No outono é uma das vistas mais fotografadas do Japão — o vermelho do bordo emoldurando a queda.'
	},
	{
		id: 'nikko-chuzenji',
		destinoId: 'nikko',
		nome: 'Lago Chuzenji + onsen',
		tipo: 'relaxamento',
		duracao: 4,
		custo: 'medio',
		melhorHorario: 'tarde',
		descricao: 'Lago vulcânico a 1.300m de altitude com vilas de águas termais ao redor.',
		dica: 'Pegue a estrada Irohazaka pra subir — 48 curvas em S, todas batizadas com letras do alfabeto antigo.'
	},
	{
		id: 'nikko-shinkyo',
		destinoId: 'nikko',
		nome: 'Ponte Shinkyo',
		tipo: 'cultural',
		duracao: 0.5,
		custo: 'baixo',
		melhorHorario: 'manha',
		descricao: 'Ponte vermelha de madeira sobre o rio Daiya, marca a entrada da área sagrada de Nikko.',
		dica: 'É um pit-stop de 15 minutos. Foto rápida e siga pro Tosho-gu.'
	},
	{
		id: 'nikko-rinnoji',
		destinoId: 'nikko',
		nome: 'Templo Rinno-ji',
		tipo: 'cultural',
		duracao: 1.5,
		custo: 'baixo',
		melhorHorario: 'manha',
		descricao: 'Templo budista com três Budas dourados gigantes (4.5m de altura cada). Faz parte do conjunto UNESCO.',
		dica: 'Vai antes do Tosho-gu — eles ficam a 5 min de caminhada e o ingresso combo sai mais barato.'
	},

	// === Takayama ===
	{
		id: 'takayama-sanmachi',
		destinoId: 'takayama',
		nome: 'Sanmachi Suji',
		tipo: 'cultural',
		duracao: 2,
		custo: 'gratuito',
		melhorHorario: 'manha',
		descricao: 'Três ruas Edo intactas com fachadas de madeira escura. Casas viradas em destilarias de saquê e galerias.',
		dica: 'Procure as bolas redondas de cedro penduradas — são "sugidama" e indicam que a destilaria abriu o saquê novo.'
	},
	{
		id: 'takayama-mercado',
		destinoId: 'takayama',
		nome: 'Mercado matinal Miyagawa',
		tipo: 'gastronomia',
		duracao: 1.5,
		custo: 'baixo',
		melhorHorario: 'manha',
		descricao: 'Barracas à beira-rio com produtores locais — cogumelos da estação, mitarashi-dango, pickles caseiros.',
		dica: 'Aberto só de 7h-12h. Tente o "gohei mochi" — bolinho de arroz tostado com molho de noz e missô.'
	},
	{
		id: 'takayama-jinya',
		destinoId: 'takayama',
		nome: 'Takayama Jinya',
		tipo: 'cultural',
		duracao: 1.5,
		custo: 'baixo',
		melhorHorario: 'tarde',
		descricao: 'Único prédio administrativo Edo (1692) ainda intacto no Japão. Salas de tatame, depósitos de arroz como tributo.',
		dica: 'A sala de "interrogatório" tem chão de pedras agudas onde o suspeito ficava ajoelhado. Pesado.'
	},
	{
		id: 'takayama-folk',
		destinoId: 'takayama',
		nome: 'Hida Folk Village',
		tipo: 'cultural',
		duracao: 3,
		custo: 'medio',
		melhorHorario: 'tarde',
		descricao: 'Museu ao ar livre com 30 casas tradicionais transferidas de toda a região Hida — estilos gasshō-zukuri.',
		dica: 'Substituto bom pra Shirakawa-go se faltar tempo. No inverno o telhado de palha branco de neve é cinema.'
	},
	{
		id: 'takayama-sake',
		destinoId: 'takayama',
		nome: 'Tour de cervejarias de saquê',
		tipo: 'gastronomia',
		duracao: 2,
		custo: 'baixo',
		melhorHorario: 'tarde',
		descricao: 'Sete destilarias na cidade-velha oferecem degustação por ¥300-500. A água da neve dos Alpes faz a base.',
		dica: 'O Hida-no-hana de Funasaka é o mais celebrado. Compre uma garrafinha de viagem.'
	},

	// === Miyajima ===
	{
		id: 'miyajima-torii',
		destinoId: 'miyajima',
		nome: 'Torii flutuante de Itsukushima',
		tipo: 'cultural',
		duracao: 2,
		custo: 'gratuito',
		melhorHorario: 'tarde',
		descricao: 'O torii vermelho de 16m que parece flutuar na maré alta. Imagem-clichê do Japão por uma boa razão.',
		dica: 'Cheque a tabua de marés. Maré baixa permite andar até a base; maré alta com pôr-do-sol é o postal.'
	},
	{
		id: 'miyajima-daisho',
		destinoId: 'miyajima',
		nome: 'Templo Daisho-in',
		tipo: 'cultural',
		duracao: 1.5,
		custo: 'gratuito',
		melhorHorario: 'manha',
		descricao: 'Templo budista nas encostas com 500 estátuas Rakan, cada uma com expressão única. Caverna de mil lanternas.',
		dica: 'Subindo a escadaria, gire as rodinhas-mantra de bronze — diz a tradição que vale ler todos os sutras.'
	},
	{
		id: 'miyajima-misen',
		destinoId: 'miyajima',
		nome: 'Mt. Misen (cable car ou trilha)',
		tipo: 'natureza',
		duracao: 4,
		custo: 'medio',
		melhorHorario: 'manha',
		descricao: 'Topo de 535m com vista do Mar Interior + ilhotas. Trilha de 1h40 ou cable car em 15 min.',
		dica: 'Os macacos selvagens do topo são reais e inteligentes. Nada de comida na mão exposta.'
	},
	{
		id: 'miyajima-anago',
		destinoId: 'miyajima',
		nome: 'Anago-meshi (enguia local)',
		tipo: 'gastronomia',
		duracao: 1,
		custo: 'medio',
		melhorHorario: 'tarde',
		descricao: 'Especialidade da ilha: enguia marinha grelhada com molho doce sobre arroz. Diferente de unagi.',
		dica: 'Ueno é a casa centenária — fila de 1h às 12h. Fuji-i é igual de bom e sem fila.'
	},
	{
		id: 'miyajima-omotesando',
		destinoId: 'miyajima',
		nome: 'Omotesando + cervos',
		tipo: 'compras',
		duracao: 2,
		custo: 'baixo',
		melhorHorario: 'tarde',
		descricao: 'Rua de comércio com 200 lojas — momiji-manjū (bolinho com formato de bordo) é assinatura.',
		dica: 'Os cervos roubam bolsa, papel, mapa. Não é piada — guarde o ingresso do ferry.'
	},

	// === Okinawa ===
	{
		id: 'okinawa-kerama',
		destinoId: 'okinawa',
		nome: 'Mergulho nas ilhas Kerama',
		tipo: 'natureza',
		duracao: 7,
		custo: 'alto',
		melhorHorario: 'manha',
		descricao: 'Águas turquesa com visibilidade de 30m, tartarugas verdes em quase todo dia, recife intacto.',
		dica: 'Saindo de Naha, os passeios de meio dia já chegam. Tartaruga vista quase garantida em Tokashiki.'
	},
	{
		id: 'okinawa-shuri',
		destinoId: 'okinawa',
		nome: 'Castelo de Shuri',
		tipo: 'cultural',
		duracao: 2,
		custo: 'baixo',
		melhorHorario: 'manha',
		descricao: 'Antiga sede do reino de Ryukyu, distinto do estilo Edo. Sofreu incêndio em 2019 — em reconstrução.',
		dica: 'Mesmo em obras vale — algumas seções abertas mostram o processo de restauração tradicional.'
	},
	{
		id: 'okinawa-churaumi',
		destinoId: 'okinawa',
		nome: 'Aquário Churaumi',
		tipo: 'natureza',
		duracao: 3,
		custo: 'medio',
		melhorHorario: 'tarde',
		descricao: 'Um dos maiores do mundo. Tubarão-baleia + arraia-manta + mais 700 espécies num único tanque gigante.',
		dica: 'Vá no fim de tarde — o sol entrando no tanque principal é uma das fotos mais memoráveis.'
	},
	{
		id: 'okinawa-kokusai',
		destinoId: 'okinawa',
		nome: 'Kokusai-dōri (Naha)',
		tipo: 'compras',
		duracao: 2,
		custo: 'baixo',
		melhorHorario: 'noite',
		descricao: 'Avenida principal de Naha. Awamori (destilado local), shisa (leões guardiães) de cerâmica, comida de rua.',
		dica: 'Saia da avenida e entre no mercado Makishi paralelo — comida de rua sem turismo, peixes coloridos.'
	},
	{
		id: 'okinawa-ishigaki',
		destinoId: 'okinawa',
		nome: 'Ishigaki + Iriomote (day-trip)',
		tipo: 'natureza',
		duracao: 9,
		custo: 'alto',
		melhorHorario: 'manha',
		descricao: 'Ilha tropical pura: praia Kabira, mangues de Iriomote pra kayak, gato selvagem (raríssimo).',
		dica: 'Voo de 1h de Naha. Pra realmente apreciar, pernoite em Ishigaki — é a base ideal das Yaeyama.'
	},

	// === Sapporo ===
	{
		id: 'sapporo-nijo',
		destinoId: 'sapporo',
		nome: 'Mercado Nijō',
		tipo: 'gastronomia',
		duracao: 1.5,
		custo: 'medio',
		melhorHorario: 'manha',
		descricao: 'Mercado de frutos do mar de Hokkaido. Caranguejo-rei, ouriço (uni), salmão-vermelho, atum gordo.',
		dica: 'Kaisen-don (tigela de sashimi misto) no Donburi-Chaya — clássico, sem firula, frutos do mar gigantes.'
	},
	{
		id: 'sapporo-snowfest',
		destinoId: 'sapporo',
		nome: 'Sapporo Snow Festival',
		tipo: 'cultural',
		duracao: 4,
		custo: 'gratuito',
		melhorHorario: 'noite',
		descricao: 'Esculturas gigantes de neve e gelo de equipes do mundo todo. Toma o Parque Odori e Susukino na 1ª semana de fevereiro.',
		dica: 'À noite, com iluminação colorida, é completamente diferente. Vá nas duas vezes (dia e noite).'
	},
	{
		id: 'sapporo-odori',
		destinoId: 'sapporo',
		nome: 'Parque Odori + Torre',
		tipo: 'natureza',
		duracao: 2,
		custo: 'baixo',
		melhorHorario: 'tarde',
		descricao: 'Parque linear que corta a cidade. Torre de TV no topo dá vista 360º, especialmente bonita ao pôr-do-sol.',
		dica: 'No verão tem festival de cerveja gigante (julho). No inverno é palco do Snow Festival.'
	},
	{
		id: 'sapporo-cervejaria',
		destinoId: 'sapporo',
		nome: 'Museu da Cervejaria Sapporo',
		tipo: 'gastronomia',
		duracao: 2,
		custo: 'baixo',
		melhorHorario: 'tarde',
		descricao: 'Prédio de tijolo de 1890. Histórico da cerveja japonesa + degustação no fim. Genghis Khan (cordeiro grelhado) no restaurante anexo.',
		dica: 'Tour gratuito, degustação custa ¥500 por copo. Combine com janta de Genghis Khan na frente.'
	},
	{
		id: 'sapporo-niseko',
		destinoId: 'sapporo',
		nome: 'Day-trip a Niseko (esqui)',
		tipo: 'natureza',
		duracao: 9,
		custo: 'alto',
		melhorHorario: 'manha',
		descricao: 'Resort de esqui mais famoso do Japão, neve em pó-de-talco. 2h de carro de Sapporo.',
		dica: 'Janeiro-fevereiro tem a melhor neve do mundo. Em junho-outubro fica deserto e barato pra trilhas.'
	},

	// === Kamakura ===
	{
		id: 'kamakura-daibutsu',
		destinoId: 'kamakura',
		nome: 'Daibutsu de Kotoku-in',
		tipo: 'cultural',
		duracao: 1.5,
		custo: 'baixo',
		melhorHorario: 'manha',
		descricao: 'Buda de bronze de 13m, ao ar livre desde 1495 (o templo que o cobria foi destruído por tsunami).',
		dica: 'Por ¥50 você entra dentro do Buda — vê a estrutura oca de bronze. Vale a foto bizarra.'
	},
	{
		id: 'kamakura-hase',
		destinoId: 'kamakura',
		nome: 'Templo Hase-dera',
		tipo: 'cultural',
		duracao: 1.5,
		custo: 'baixo',
		melhorHorario: 'manha',
		descricao: 'Templo nas encostas com vista da baía de Sagami. Estátua de Kannon de 9m em madeira, das mais antigas do Japão.',
		dica: 'A trilha lateral leva a um jardim de hortênsias — entre maio e junho é o lugar mais lotado do Japão.'
	},
	{
		id: 'kamakura-tsurugaoka',
		destinoId: 'kamakura',
		nome: 'Tsurugaoka Hachimangu',
		tipo: 'cultural',
		duracao: 2,
		custo: 'gratuito',
		melhorHorario: 'tarde',
		descricao: 'Santuário fundado pelo primeiro shogun. Caminhada cerimonial pela rua principal Wakamiya-oji.',
		dica: 'Em ano-novo é onde toda Tokyo vai rezar — fila de 4h. Em outro mês é vazio.'
	},
	{
		id: 'kamakura-komachi',
		destinoId: 'kamakura',
		nome: 'Komachi-dōri',
		tipo: 'compras',
		duracao: 2,
		custo: 'baixo',
		melhorHorario: 'tarde',
		descricao: 'Rua de comércio entre estação e Tsurugaoka. Bolinhos shirasu (sardinhas brancas), murasaki-imo (sorvete batata-roxa).',
		dica: 'Pule o que tem fila gigante; entre nas vielas laterais — onde os locais comem.'
	},
	{
		id: 'kamakura-yuigahama',
		destinoId: 'kamakura',
		nome: 'Praia de Yuigahama',
		tipo: 'relaxamento',
		duracao: 2.5,
		custo: 'gratuito',
		melhorHorario: 'tarde',
		descricao: 'Praia de mar batido com vista do Fuji em dias limpos. Cultura surf local + cafés à beira-mar.',
		dica: 'No verão há "umi-no-ie" (barracas de praia) que servem cerveja e curry de manhã ao pôr-do-sol.'
	},

	// === Beppu ===
	{
		id: 'beppu-jigoku',
		destinoId: 'beppu',
		nome: 'Jigoku-meguri (8 infernos)',
		tipo: 'natureza',
		duracao: 4,
		custo: 'medio',
		melhorHorario: 'manha',
		descricao: 'Tour pelos 8 "infernos" termais — lago de sangue (vermelho), água azul cobalto, gêiser regular.',
		dica: 'Compre o passe combinado (¥2200 pelos 8) na primeira entrada. Não precisa entrar nos 8 — escolha 4-5.'
	},
	{
		id: 'beppu-takegawara',
		destinoId: 'beppu',
		nome: 'Banho de areia Takegawara',
		tipo: 'relaxamento',
		duracao: 1.5,
		custo: 'baixo',
		melhorHorario: 'tarde',
		descricao: 'Você é "enterrado" em areia preta vulcânica a 50ºC por 15-20 min. Catártico, suor instantâneo.',
		dica: 'Onsen tradicional aberto desde 1879. Tatame, banheira de madeira, ritual completo.'
	},
	{
		id: 'beppu-tsurumi',
		destinoId: 'beppu',
		nome: 'Mt. Tsurumi (cable car)',
		tipo: 'natureza',
		duracao: 2.5,
		custo: 'medio',
		melhorHorario: 'manha',
		descricao: 'Cable car sobe a 1.375m. Vista da baía + cidade fumegante de vapor + mar de neve no inverno.',
		dica: 'Em primavera, o sakura sobe a montanha gradualmente — fim de março na base, fim de abril no topo.'
	},
	{
		id: 'beppu-yufuin',
		destinoId: 'beppu',
		nome: 'Day-trip a Yufuin',
		tipo: 'cultural',
		duracao: 6,
		custo: 'medio',
		melhorHorario: 'manha',
		descricao: 'Vilarejo de onsen vizinho, mais bonito e refinado que Beppu. Lago Kinrin com fumarolas, ruelas de artesanato.',
		dica: 'Pegue o trem panorâmico Yufuin-no-mori desde Hakata — a viagem em si é o passeio.'
	},
	{
		id: 'beppu-jigoku-mushi',
		destinoId: 'beppu',
		nome: 'Jigoku-mushi (cozinha a vapor)',
		tipo: 'gastronomia',
		duracao: 1.5,
		custo: 'baixo',
		melhorHorario: 'tarde',
		descricao: 'Você cozinha sua própria comida no vapor termal. Camarão, carne, ovos, batata-doce, milho — tudo num cesto sobre a fonte.',
		dica: 'Jigoku-mushi Kobo no centro é o mais turístico, mas funciona. Reserve com 1h de antecedência.'
	}
];

export function atividadesPorDestino(destinoId: string): Atividade[] {
	return ATIVIDADES.filter((a) => a.destinoId === destinoId);
}

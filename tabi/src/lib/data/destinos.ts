import type { Destino } from '../types';

export const DESTINOS: Destino[] = [
	{
		id: 'kyoto',
		nome: 'Kyoto',
		nomejp: '京都',
		kanji: '京',
		descricao:
			'Capital imperial por mais de mil anos. Templos zen, jardins de musgo, gueixas no Gion e ruas de pedra que parecem suspensas no tempo.',
		categorias: {
			natureza: 6,
			cultura: 10,
			modernidade: 3,
			gastronomia: 8,
			aventura: 3,
			tranquilidade: 9
		},
		melhorEpoca: ['spring', 'autumn'],
		custoDiario: 'moderado',
		pontosPrincipais: [
			'Fushimi Inari (mil torii)',
			'Floresta de bambu de Arashiyama',
			'Bairro de Gion',
			'Kinkaku-ji (Pavilhão Dourado)',
			'Templo Kiyomizu-dera'
		],
		dicaLocal:
			'Vá ao Fushimi Inari antes das 7h — sem multidão, com névoa entre os torii. Vale o despertador.',
		unsplashId: '1545569341-9eb8b30979d9' 
	},
	{
		id: 'tokyo',
		nome: 'Tokyo',
		nomejp: '東京',
		kanji: '東',
		descricao:
			'Metrópole de 14 milhões que mistura neon de Shinjuku, calmaria de templos centenários e os melhores restaurantes do mundo a poucos quarteirões um do outro.',
		categorias: {
			natureza: 3,
			cultura: 7,
			modernidade: 10,
			gastronomia: 10,
			aventura: 8,
			tranquilidade: 3
		},
		melhorEpoca: ['spring', 'autumn', 'winter'],
		custoDiario: 'confortavel',
		pontosPrincipais: [
			'Shibuya Crossing e Harajuku',
			'Senso-ji em Asakusa',
			'TeamLab Planets',
			'Mercado de Toyosu',
			'Shimokitazawa (vintage e cafés)'
		],
		dicaLocal:
			'Compre um Suica/Pasmo no aeroporto. Trens são absurdamente eficientes — táxi quase nunca compensa.',
		unsplashId: '1542051841857-5f90071e7989'
	},
	{
		id: 'osaka',
		nome: 'Osaka',
		nomejp: '大阪',
		kanji: '阪',
		descricao:
			'A cozinha do Japão. Takoyaki, okonomiyaki, kushikatsu — comida de rua barulhenta, gente extrovertida e o melhor humor do país.',
		categorias: {
			natureza: 2,
			cultura: 6,
			modernidade: 8,
			gastronomia: 10,
			aventura: 7,
			tranquilidade: 3
		},
		melhorEpoca: ['spring', 'summer', 'autumn'],
		custoDiario: 'moderado',
		pontosPrincipais: [
			'Dotonbori e Glico Sign',
			'Castelo de Osaka',
			'Kuromon Ichiba (mercado)',
			'Bairro de Shinsekai',
			'Universal Studios Japan'
		],
		dicaLocal:
			'Em Osaka diz-se "kuidaore" — comer até cair. Aceite o convite e vá em três restaurantes pequenos em vez de um grande.',
		unsplashId: '1589452271712-64b8a66c7b71'
	},
	{
		id: 'hakone',
		nome: 'Hakone',
		nomejp: '箱根',
		kanji: '箱',
		descricao:
			'Vilarejo de águas termais aos pés do Monte Fuji. Onsens em ryokans tradicionais, lago Ashi e silêncio cortado só pelo barulho do vapor.',
		categorias: {
			natureza: 9,
			cultura: 7,
			modernidade: 2,
			gastronomia: 6,
			aventura: 5,
			tranquilidade: 10
		},
		melhorEpoca: ['spring', 'autumn', 'winter'],
		custoDiario: 'confortavel',
		pontosPrincipais: [
			'Onsens em ryokan tradicional',
			'Lago Ashi e barco pirata',
			'Hakone Open-Air Museum',
			'Owakudani (vapor sulfúrico)',
			'Vista do Fuji do Mt. Komagatake'
		],
		dicaLocal:
			'Compre o Hakone Free Pass. Cobre teleférico, barco, ônibus e trem do circuito — economiza muito.',
		unsplashId: '1583901362846-13c55e045708'
	},
	{
		id: 'nara',
		nome: 'Nara',
		nomejp: '奈良',
		kanji: '鹿',
		descricao:
			'Primeira capital do Japão. Templos enormes em escala dramática, e cervos sagrados que andam livres pelas ruas e fazem reverência por biscoitos.',
		categorias: {
			natureza: 7,
			cultura: 9,
			modernidade: 2,
			gastronomia: 5,
			aventura: 4,
			tranquilidade: 8
		},
		melhorEpoca: ['spring', 'autumn'],
		custoDiario: 'economico',
		pontosPrincipais: [
			'Todai-ji e o Grande Buda',
			'Parque de Nara (cervos)',
			'Kasuga Taisha (lanternas)',
			'Naramachi (cidade antiga)',
			'Monte Wakakusa'
		],
		dicaLocal:
			'Day-trip funciona, mas dormir em Nara muda tudo: ao anoitecer os turistas vão embora e o parque fica seu.',
		unsplashId: '1530708780517-cc640cf05561'
	},
	{
		id: 'kanazawa',
		nome: 'Kanazawa',
		nomejp: '金沢',
		kanji: '金',
		descricao:
			'A "pequena Kyoto" do mar do Japão. Bairro de samurais preservado, jardim Kenroku-en (um dos três mais belos do país) e a melhor gastronomia regional.',
		categorias: {
			natureza: 6,
			cultura: 9,
			modernidade: 5,
			gastronomia: 9,
			aventura: 4,
			tranquilidade: 8
		},
		melhorEpoca: ['spring', 'autumn', 'winter'],
		custoDiario: 'moderado',
		pontosPrincipais: [
			'Jardim Kenroku-en',
			'Bairro Higashi Chaya',
			'Castelo de Kanazawa',
			'Mercado Omicho',
			'21st Century Museum of Contemporary Art'
		],
		dicaLocal:
			'Kanazawa tem 99% do ouro folheado do Japão. Experimente sorvete coberto de folha de ouro — kitsch mas inevitável.',
		unsplashId: '1720792445193-7e288489b292'
	},
	{
		id: 'hiroshima',
		nome: 'Hiroshima',
		nomejp: '広島',
		kanji: '広',
		descricao:
			'Cidade reconstruída sobre uma das tragédias mais pesadas do século XX. Hoje é símbolo de paz, parques largos à beira-rio e a melhor okonomiyaki do Japão.',
		categorias: {
			natureza: 5,
			cultura: 9,
			modernidade: 6,
			gastronomia: 8,
			aventura: 4,
			tranquilidade: 6
		},
		melhorEpoca: ['spring', 'autumn'],
		custoDiario: 'moderado',
		pontosPrincipais: [
			'Parque Memorial da Paz',
			'Cúpula da Bomba Atômica',
			'Castelo de Hiroshima',
			'Jardim Shukkei-en',
			'Okonomi-mura (prédio inteiro de okonomiyaki)'
		],
		dicaLocal:
			'Vá ao Memorial bem cedo, antes das excursões chegarem. O silêncio do parque vazio é parte da experiência.',
		unsplashId: '1574773774523-c8007253ef49'
	},
	{
		id: 'nikko',
		nome: 'Nikko',
		nomejp: '日光',
		kanji: '日',
		descricao:
			'Floresta de cedros milenares escondendo o santuário mais ornamentado do Japão. Cachoeiras, lago vulcânico e o luxo barroco do Tosho-gu — tudo a 2h de Tokyo.',
		categorias: {
			natureza: 9,
			cultura: 10,
			modernidade: 2,
			gastronomia: 5,
			aventura: 5,
			tranquilidade: 9
		},
		melhorEpoca: ['spring', 'autumn'],
		custoDiario: 'moderado',
		pontosPrincipais: [
			'Santuário Tosho-gu',
			'Cataratas de Kegon',
			'Lago Chuzenji',
			'Ponte Shinkyo',
			'Templo Rinno-ji'
		],
		dicaLocal:
			'Pernoite em ryokan em Chuzenji-onsen. Day-trip de Tokyo te dá Tosho-gu; pernoitar te dá o lago no amanhecer sem ninguém.',
		unsplashId: '1598420328973-18484a664428'
	},
	{
		id: 'takayama',
		nome: 'Takayama',
		nomejp: '高山',
		kanji: '飛',
		descricao:
			'Cidadezinha dos Alpes Japoneses com ruas Edo intactas, fabricantes de saquê de séculos e o melhor wagyu da região (Hida beef). Base pra Shirakawa-go.',
		categorias: {
			natureza: 7,
			cultura: 9,
			modernidade: 3,
			gastronomia: 8,
			aventura: 5,
			tranquilidade: 9
		},
		melhorEpoca: ['spring', 'autumn', 'winter'],
		custoDiario: 'moderado',
		pontosPrincipais: [
			'Sanmachi Suji (rua Edo preservada)',
			'Mercado matinal Miyagawa',
			'Takayama Jinya',
			'Hida Folk Village',
			'Tour de cervejarias de saquê'
		],
		dicaLocal:
			'Use Takayama de base e faça day-trip a Shirakawa-go. As gasshō-zukuri (casas de palha em "mãos rezando") no inverno parecem cenário de filme.',
		unsplashId: '1676917350107-964194678afa'
	},
	{
		id: 'miyajima',
		nome: 'Miyajima',
		nomejp: '宮島',
		kanji: '厳',
		descricao:
			'Ilha sagrada com o torii flutuante mais famoso do mundo. Cervos andam livres, o templo Itsukushima parece nascer da maré e Mt. Misen entrega vista pra eternidade.',
		categorias: {
			natureza: 9,
			cultura: 9,
			modernidade: 1,
			gastronomia: 7,
			aventura: 6,
			tranquilidade: 10
		},
		melhorEpoca: ['spring', 'summer', 'autumn'],
		custoDiario: 'confortavel',
		pontosPrincipais: [
			'Torii flutuante de Itsukushima',
			'Templo Daisho-in',
			'Mt. Misen (cable car ou trilha)',
			'Cervos sagrados de Miyajima',
			'Omotesandō (rua de comércio histórica)'
		],
		dicaLocal:
			'Durma na ilha. À noite, com o torii iluminado e os day-trippers de volta no continente, parece que a ilha é só sua.',
		unsplashId: '1660212918322-d8b71f3c8ffe'
	},
	{
		id: 'okinawa',
		nome: 'Okinawa',
		nomejp: '沖縄',
		kanji: '沖',
		descricao:
			'O Japão tropical. Praias caribenhas, recife de coral, cultura Ryukyu distinta do resto do país, e um ritmo de vida que é o oposto exato de Tokyo.',
		categorias: {
			natureza: 10,
			cultura: 7,
			modernidade: 5,
			gastronomia: 7,
			aventura: 8,
			tranquilidade: 8
		},
		melhorEpoca: ['spring', 'summer', 'autumn'],
		custoDiario: 'moderado',
		pontosPrincipais: [
			'Ilhas Kerama (mergulho)',
			'Castelo de Shuri (Naha)',
			'Aquário Churaumi',
			'Kokusai-dōri (Naha)',
			'Ilhas Yaeyama (Ishigaki, Iriomote)'
		],
		dicaLocal:
			'Pule Naha e voe direto pra Ishigaki ou Iriomote. As ilhas pequenas é onde o Okinawa que você imaginou existe de verdade.',
		unsplashId: '1609673889466-61145b2084f3'
	},
	{
		id: 'sapporo',
		nome: 'Sapporo',
		nomejp: '札幌',
		kanji: '札',
		descricao:
			'Capital de Hokkaido. Ramen miso, frutos do mar absurdos, neve pesada no inverno e o festival de esculturas de gelo que toma a cidade em fevereiro.',
		categorias: {
			natureza: 7,
			cultura: 5,
			modernidade: 8,
			gastronomia: 10,
			aventura: 8,
			tranquilidade: 5
		},
		melhorEpoca: ['summer', 'winter'],
		custoDiario: 'moderado',
		pontosPrincipais: [
			'Mercado Nijō (caranguejo, uni)',
			'Sapporo Snow Festival (fevereiro)',
			'Parque Odori',
			'Cervejaria Sapporo (museu + degustação)',
			'Niseko (esqui, 2h de carro)'
		],
		dicaLocal:
			'Vá no Snow Festival. Odori vira museu de gelo a céu aberto com esculturas de equipes do mundo todo — é gratuito e dura uma semana.',
		unsplashId: '1619338360476-37195f14909e'
	},

	{
		id: 'kamakura',
		nome: 'Kamakura',
		nomejp: '鎌倉',
		kanji: '鎌',
		descricao:
			'Capital dos shoguns no século XII, hoje cidade-praia a 1h de Tokyo. Buda gigante de bronze, templos no meio da mata e cafés de surfista na orla.',
		categorias: {
			natureza: 7,
			cultura: 9,
			modernidade: 3,
			gastronomia: 6,
			aventura: 4,
			tranquilidade: 8
		},
		melhorEpoca: ['spring', 'summer', 'autumn'],
		custoDiario: 'economico',
		pontosPrincipais: [
			'Grande Buda (Daibutsu de Kotoku-in)',
			'Templo Hase-dera',
			'Tsurugaoka Hachiman-gū',
			'Komachi-dōri (rua de comércio)',
			'Praia de Yuigahama'
		],
		dicaLocal:
			'Vá num dia de semana. Sábado é caos absoluto de gente de Tokyo — você não consegue nem ver o Buda direito.',
		unsplashId: '1706516510664-a8d1e7577eeb'
	},
	{
		id: 'beppu',
		nome: 'Beppu',
		nomejp: '別府',
		kanji: '別',
		descricao:
			'Cidade que solta vapor pelas grades de bueiro. Oito "infernos" termais coloridos, banho de areia vulcânica e a maior produção de água quente do Japão.',
		categorias: {
			natureza: 9,
			cultura: 6,
			modernidade: 3,
			gastronomia: 6,
			aventura: 6,
			tranquilidade: 9
		},
		melhorEpoca: ['spring', 'autumn', 'winter'],
		custoDiario: 'economico',
		pontosPrincipais: [
			'Os 8 "infernos" (Jigoku-meguri)',
			'Banho de areia em Takegawara',
			'Mt. Tsurumi (cable car)',
			'Yufuin (vilarejo de onsen vizinho)',
			'Jigoku-mushi (comida cozida no vapor)'
		],
		dicaLocal:
			'Faça os 8 infernos num dia, mas reserve outro pro banho de areia. Você é enterrado vivo em areia preta a 50°C — soa estranho, é catártico.',
		unsplashId: '1585441794710-34cfa514f604'
	}
];

export function destinoById(id: string): Destino | undefined {
	return DESTINOS.find((d) => d.id === id);
}

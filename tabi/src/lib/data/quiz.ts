import type { QuizQuestion } from '../types';

export const QUIZ: QuizQuestion[] = [
	{
		id: 'ritmo',
		prompt: 'Qual ritmo de viagem te representa?',
		hint: 'Pense em como você quer acordar de manhã.',
		options: [
			{
				id: 'intenso',
				label: 'Intenso e cheio',
				description: 'Acordo cedo, vou dormir tarde, encaixo tudo.',
				icon: '⚡',
				delta: { aventura: 3, modernidade: 2, tranquilidade: -2 }
			},
			{
				id: 'calmo',
				label: 'Calmo e contemplativo',
				description: 'Sem pressa. Um bom café conta como atividade.',
				icon: '🍵',
				delta: { tranquilidade: 3, cultura: 2, natureza: 1 }
			},
			{
				id: 'equilibrado',
				label: 'Equilibrado',
				description: 'Manhã com calma, tarde explorando, noite respirando.',
				icon: '☯',
				delta: { cultura: 1, gastronomia: 1, tranquilidade: 1 }
			}
		]
	},
	{
		id: 'atrai',
		prompt: 'O que mais te atrai no Japão?',
		options: [
			{
				id: 'natureza',
				label: 'Natureza',
				description: 'Vulcões, florestas, o Fuji, onsens.',
				icon: '🗻',
				delta: { natureza: 4, tranquilidade: 1 }
			},
			{
				id: 'tecnologia',
				label: 'Tecnologia e modernidade',
				description: 'Tokyo, Akihabara, arquitetura futurista.',
				icon: '🌃',
				delta: { modernidade: 4, aventura: 1 }
			},
			{
				id: 'tradicao',
				label: 'Cultura e tradição',
				description: 'Templos, gueixas, cerâmica, caligrafia.',
				icon: '⛩',
				delta: { cultura: 4, tranquilidade: 1 }
			},
			{
				id: 'gastronomia',
				label: 'Gastronomia',
				description: 'Sushi, ramen, kaiseki, izakayas.',
				icon: '🍣',
				delta: { gastronomia: 4, cultura: 1 }
			}
		]
	},
	{
		id: 'acomodacao',
		prompt: 'Que tipo de acomodação te conquista?',
		options: [
			{
				id: 'ryokan',
				label: 'Ryokan tradicional',
				description: 'Tatame, futon, onsen, kaiseki no quarto.',
				icon: '🏯',
				delta: { cultura: 3, tranquilidade: 2 },
				budget: 'confortavel'
			},
			{
				id: 'hotel',
				label: 'Hotel moderno',
				description: 'Conforto previsível, vista da janela, cama macia.',
				icon: '🏨',
				delta: { modernidade: 2 },
				budget: 'moderado'
			},
			{
				id: 'hostel',
				label: 'Hostel e socialização',
				description: 'Pessoas novas, dicas trocadas no café da manhã.',
				icon: '🎒',
				delta: { aventura: 2 },
				budget: 'economico'
			},
			{
				id: 'capsula',
				label: 'Cápsula minimalista',
				description: 'Pequeno, eficiente, japonês ao extremo.',
				icon: '🛏',
				delta: { modernidade: 2, aventura: 1 },
				budget: 'economico'
			}
		]
	},
	{
		id: 'epoca',
		prompt: 'Qual época te puxa mais?',
		options: [
			{
				id: 'spring',
				label: 'Primavera — sakura',
				description: 'Flores de cerejeira, hanami nos parques.',
				icon: '🌸',
				delta: { cultura: 2, natureza: 2 }
			},
			{
				id: 'summer',
				label: 'Verão — festivais',
				description: 'Matsuri, fogos de artifício, yukatas.',
				icon: '🎆',
				delta: { aventura: 2, cultura: 2 }
			},
			{
				id: 'autumn',
				label: 'Outono — momiji',
				description: 'Folhas vermelhas, jardins em fogo.',
				icon: '🍁',
				delta: { natureza: 2, tranquilidade: 2 }
			},
			{
				id: 'winter',
				label: 'Inverno — neve',
				description: 'Onsens fumegantes, vilas cobertas de branco.',
				icon: '❄',
				delta: { tranquilidade: 2, natureza: 2 }
			}
		]
	},
	{
		id: 'multidoes',
		prompt: 'Como você se sente em multidões?',
		options: [
			{
				id: 'amo',
				label: 'Amo a energia',
				description: 'Quanto mais gente, mais vivo me sinto.',
				icon: '🔥',
				delta: { modernidade: 3, aventura: 2, tranquilidade: -2 }
			},
			{
				id: 'evito',
				label: 'Prefiro evitar',
				description: 'Espaço e silêncio são meu combustível.',
				icon: '🌿',
				delta: { tranquilidade: 3, natureza: 2, modernidade: -2 }
			},
			{
				id: 'depende',
				label: 'Depende do contexto',
				description: 'Festival sim, fila de turismo não.',
				icon: '🤔',
				delta: { cultura: 1, gastronomia: 1 }
			}
		]
	},
	{
		id: 'comida',
		prompt: 'Sua relação com comida é:',
		options: [
			{
				id: 'aventureiro',
				label: 'Aventureiro total',
				description: 'Ouriço cru? Natto? Manda ver.',
				icon: '🦑',
				delta: { gastronomia: 4, aventura: 2 }
			},
			{
				id: 'conhecido',
				label: 'Prefiro o conhecido',
				description: 'Ramen e gyoza me deixam feliz.',
				icon: '🍜',
				delta: { gastronomia: 1 }
			},
			{
				id: 'curioso',
				label: 'Quero experimentar com cuidado',
				description: 'Topo provar, mas com um plano B no bolso.',
				icon: '🥢',
				delta: { gastronomia: 2, cultura: 1 }
			}
		]
	},
	{
		id: 'cidade',
		prompt: 'Você prefere:',
		options: [
			{
				id: 'metropole',
				label: 'Cidades grandes e vibrantes',
				description: 'Tokyo, Osaka — sem dó.',
				icon: '🏙',
				delta: { modernidade: 3, gastronomia: 2 }
			},
			{
				id: 'charmosa',
				label: 'Cidades pequenas e charmosas',
				description: 'Kanazawa, Takayama — escala humana.',
				icon: '🏘',
				delta: { cultura: 3, tranquilidade: 2 }
			},
			{
				id: 'interior',
				label: 'Natureza e interior',
				description: 'Vilas, montanhas, lagos.',
				icon: '🏞',
				delta: { natureza: 4, tranquilidade: 2 }
			}
		]
	},
	{
		id: 'orcamento',
		prompt: 'Orçamento diário estimado:',
		hint: 'Estimativa por pessoa, sem voo internacional.',
		options: [
			{
				id: 'economico',
				label: 'Econômico',
				description: 'Até ¥10.000 / dia — hostels, comida de rua.',
				icon: '🪙',
				delta: {},
				budget: 'economico'
			},
			{
				id: 'moderado',
				label: 'Moderado',
				description: '¥10.000–20.000 / dia — hotéis 3★, restaurantes médios.',
				icon: '💴',
				delta: {},
				budget: 'moderado'
			},
			{
				id: 'confortavel',
				label: 'Confortável',
				description: '¥20.000–35.000 / dia — ryokan ocasional, kaiseki.',
				icon: '🪭',
				delta: {},
				budget: 'confortavel'
			},
			{
				id: 'premium',
				label: 'Premium',
				description: '¥35.000+ / dia — experiências sem teto.',
				icon: '✨',
				delta: {},
				budget: 'premium'
			}
		]
	}
];

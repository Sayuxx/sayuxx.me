import type { Persona } from '../types';

export const PERSONAS: Persona[] = [
	{
		id: 'peregrino',
		nome: 'O Peregrino Contemplativo',
		nomejp: '巡礼者',
		kanji: '巡',
		descricao:
			'Você viaja em silêncio. Procura templos vazios ao amanhecer, jardins de pedra e o som de sinos distantes. O Japão da quietude foi feito para você.',
		vector: {
			natureza: 7,
			cultura: 10,
			modernidade: 2,
			gastronomia: 6,
			aventura: 3,
			tranquilidade: 10
		}
	},
	{
		id: 'cacador-urbano',
		nome: 'O Caçador Urbano',
		nomejp: '都市探検家',
		kanji: '都',
		descricao:
			'Você quer a vertigem do Japão moderno: neon de Shinjuku, vending machines impossíveis, izakayas escondidos em becos. Energia, pop culture e vida noturna.',
		vector: {
			natureza: 2,
			cultura: 6,
			modernidade: 10,
			gastronomia: 9,
			aventura: 9,
			tranquilidade: 2
		}
	},
	{
		id: 'naturalista',
		nome: 'O Buscador da Natureza',
		nomejp: '山旅人',
		kanji: '山',
		descricao:
			'Você quer o Japão dos vulcões, dos onsens fumegantes e das trilhas entre cedros milenares. Floresta, lagos e o Fuji recortando o horizonte.',
		vector: {
			natureza: 10,
			cultura: 6,
			modernidade: 2,
			gastronomia: 6,
			aventura: 8,
			tranquilidade: 9
		}
	},
	{
		id: 'sibarita',
		nome: 'O Gourmet Cultural',
		nomejp: '美食家',
		kanji: '味',
		descricao:
			'Você viaja pela mesa. Sushi de balcão, kaiseki, mercados, sake regional — combinado com história, museus e bairros bem preservados.',
		vector: {
			natureza: 4,
			cultura: 9,
			modernidade: 6,
			gastronomia: 10,
			aventura: 5,
			tranquilidade: 6
		}
	}
];

export function personaById(id: string): Persona | undefined {
	return PERSONAS.find((p) => p.id === id);
}

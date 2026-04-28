import type {
	Budget,
	CategoriaVector,
	Destino,
	Persona,
	QuizQuestion,
	Resposta
} from './types';
import { BUDGET_ORDER } from './types';
import { DESTINOS } from './data/destinos';
import { PERSONAS } from './data/personas';
import { QUIZ } from './data/quiz';

const ZERO: CategoriaVector = {
	natureza: 0,
	cultura: 0,
	modernidade: 0,
	gastronomia: 0,
	aventura: 0,
	tranquilidade: 0
};

export type ScoreResult = {
	vector: CategoriaVector;
	budget: Budget;
};

export function scoreRespostas(respostas: Resposta[], questions: QuizQuestion[] = QUIZ): ScoreResult {
	const vector: CategoriaVector = { ...ZERO };
	let budget: Budget = 'moderado';

	for (const r of respostas) {
		const q = questions.find((qq) => qq.id === r.questionId);
		const opt = q?.options.find((o) => o.id === r.optionId);
		if (!opt) continue;

		for (const k of Object.keys(opt.delta) as (keyof CategoriaVector)[]) {
			vector[k] += opt.delta[k] ?? 0;
		}
		if (opt.budget) budget = opt.budget;
	}

	return { vector, budget };
}

function dot(a: CategoriaVector, b: CategoriaVector): number {
	return (
		a.natureza * b.natureza +
		a.cultura * b.cultura +
		a.modernidade * b.modernidade +
		a.gastronomia * b.gastronomia +
		a.aventura * b.aventura +
		a.tranquilidade * b.tranquilidade
	);
}

function magnitude(v: CategoriaVector): number {
	return Math.sqrt(dot(v, v));
}

export function similarity(a: CategoriaVector, b: CategoriaVector): number {
	const m = magnitude(a) * magnitude(b);
	if (m === 0) return 0;
	return dot(a, b) / m;
}

export function pickPersona(vector: CategoriaVector, personas: Persona[] = PERSONAS): Persona {
	let best = personas[0];
	let bestScore = -Infinity;
	for (const p of personas) {
		const s = similarity(vector, p.vector);
		if (s > bestScore) {
			bestScore = s;
			best = p;
		}
	}
	return best;
}

export type DestinoMatch = {
	destino: Destino;
	score: number;
	compatibility: number;
};

const BUDGET_INDEX: Record<Budget, number> = {
	economico: 0,
	moderado: 1,
	confortavel: 2,
	premium: 3
};

function budgetPenalty(target: Budget, dest: Budget): number {
	const diff = Math.abs(BUDGET_INDEX[dest] - BUDGET_INDEX[target]);
	if (diff === 0) return 1;
	if (diff === 1) return 0.85;
	if (diff === 2) return 0.65;
	return 0.45;
}

export function rankDestinos(
	result: ScoreResult,
	limit = 4,
	destinos: Destino[] = DESTINOS
): DestinoMatch[] {
	const scored = destinos.map((d) => {
		const sim = similarity(result.vector, d.categorias);
		const budgetWeight = budgetPenalty(result.budget, d.custoDiario);
		const score = sim * budgetWeight;
		return {
			destino: d,
			score,
			compatibility: Math.round(Math.min(1, Math.max(0, score)) * 100)
		};
	});

	scored.sort((a, b) => b.score - a.score);
	return scored.slice(0, limit);
}

export function budgetLabel(b: Budget): string {
	return {
		economico: 'Econômico',
		moderado: 'Moderado',
		confortavel: 'Confortável',
		premium: 'Premium'
	}[b];
}

export { BUDGET_ORDER };

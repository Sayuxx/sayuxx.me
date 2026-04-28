import type { Resposta } from '../types';
import { QUIZ } from '../data/quiz';

const STORAGE_KEY = 'tabi:quiz';

type Snapshot = {
	respostas: Resposta[];
	currentIndex: number;
};

class QuizStore {
	respostas = $state<Resposta[]>([]);
	currentIndex = $state(0);

	get total(): number {
		return QUIZ.length;
	}

	get isComplete(): boolean {
		return this.respostas.length === QUIZ.length;
	}

	get currentQuestion() {
		return QUIZ[this.currentIndex];
	}

	get progress(): number {
		return this.respostas.length / QUIZ.length;
	}

	answer(questionId: string, optionId: string): void {
		const existingIdx = this.respostas.findIndex((r) => r.questionId === questionId);
		if (existingIdx >= 0) {
			this.respostas[existingIdx] = { questionId, optionId };
		} else {
			this.respostas.push({ questionId, optionId });
		}
		this.persist();
	}

	next(): void {
		if (this.currentIndex < QUIZ.length - 1) {
			this.currentIndex += 1;
			this.persist();
		}
	}

	prev(): void {
		if (this.currentIndex > 0) {
			this.currentIndex -= 1;
			this.persist();
		}
	}

	goTo(index: number): void {
		if (index >= 0 && index < QUIZ.length) {
			this.currentIndex = index;
			this.persist();
		}
	}

	selectedFor(questionId: string): string | undefined {
		return this.respostas.find((r) => r.questionId === questionId)?.optionId;
	}

	reset(): void {
		this.respostas = [];
		this.currentIndex = 0;
		if (typeof window !== 'undefined') {
			sessionStorage.removeItem(STORAGE_KEY);
		}
	}

	hydrate(): void {
		if (typeof window === 'undefined') return;
		const raw = sessionStorage.getItem(STORAGE_KEY);
		if (!raw) return;
		try {
			const snap = JSON.parse(raw) as Snapshot;
			if (Array.isArray(snap.respostas)) this.respostas = snap.respostas;
			if (typeof snap.currentIndex === 'number') this.currentIndex = snap.currentIndex;
		} catch {
			/* ignore */
		}
	}

	private persist(): void {
		if (typeof window === 'undefined') return;
		const snap: Snapshot = {
			respostas: this.respostas,
			currentIndex: this.currentIndex
		};
		sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snap));
	}
}

export const quiz = new QuizStore();

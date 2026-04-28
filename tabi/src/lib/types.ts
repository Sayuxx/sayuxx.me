export type Categoria =
	| 'natureza'
	| 'cultura'
	| 'modernidade'
	| 'gastronomia'
	| 'aventura'
	| 'tranquilidade';

export type Estacao = 'spring' | 'summer' | 'autumn' | 'winter';

export type Budget = 'economico' | 'moderado' | 'confortavel' | 'premium';

export type CategoriaVector = Record<Categoria, number>;

export type Destino = {
	id: string;
	nome: string;
	nomejp: string;
	kanji: string;
	descricao: string;
	categorias: CategoriaVector;
	melhorEpoca: Estacao[];
	custoDiario: Budget;
	pontosPrincipais: string[];
	dicaLocal: string;
	unsplashId: string;
};

export type Persona = {
	id: string;
	nome: string;
	nomejp: string;
	kanji: string;
	descricao: string;
	vector: CategoriaVector;
};

export type QuizOption = {
	id: string;
	label: string;
	description?: string;
	icon: string;
	delta: Partial<CategoriaVector>;
	budget?: Budget;
};

export type QuizQuestion = {
	id: string;
	prompt: string;
	hint?: string;
	options: QuizOption[];
};

export type Resposta = {
	questionId: string;
	optionId: string;
};

export const BUDGET_ORDER: Budget[] = ['economico', 'moderado', 'confortavel', 'premium'];

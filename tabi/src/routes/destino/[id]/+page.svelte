<script lang="ts">
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import type { Atividade, AtividadeTipo } from '$lib/types';
	import { budgetLabel } from '$lib/matching';

	let { data } = $props();
	const { destino, atividades, restaurantes } = $derived(data);

	const photo = $derived(
		`https://images.unsplash.com/photo-${destino.unsplashId}?w=1600&auto=format&q=80&fit=crop`
	);

	const epocaLabel: Record<string, string> = {
		spring: 'primavera',
		summer: 'verão',
		autumn: 'outono',
		winter: 'inverno'
	};

	const tipoLabel: Record<AtividadeTipo, string> = {
		cultural: 'Cultura',
		natureza: 'Natureza',
		gastronomia: 'Gastronomia',
		moderno: 'Moderno',
		relaxamento: 'Relaxamento',
		compras: 'Compras'
	};

	const horarioLabel: Record<string, string> = {
		manha: 'Manhã',
		tarde: 'Tarde',
		noite: 'Noite'
	};

	const custoLabel: Record<string, string> = {
		gratuito: 'Grátis',
		baixo: 'Custo baixo',
		medio: 'Custo médio',
		alto: 'Custo alto'
	};

	const atracoes = $derived(
		atividades.filter(
			(a: Atividade) => a.tipo !== 'gastronomia' && a.tipo !== 'compras'
		)
	);
	const gastronomia = $derived(atividades.filter((a: Atividade) => a.tipo === 'gastronomia'));
	const compras = $derived(atividades.filter((a: Atividade) => a.tipo === 'compras'));

	function voltar() {
		goto(`${base}/resultado`);
	}
</script>

<svelte:head>
	<title>{destino.nome} · Tabi</title>
	<meta name="description" content={destino.descricao} />
</svelte:head>

<main class="tabi-destino-page">
	<header class="tabi-destino-hero">
		<img src={photo} alt={destino.nome} class="tabi-destino-hero-img" />
		<div class="tabi-destino-hero-overlay"></div>
		<span class="tabi-destino-hero-kanji tabi-jp" aria-hidden="true">{destino.kanji}</span>
		<div class="tabi-destino-hero-text">
			<div class="tabi-eyebrow">Destino</div>
			<h1 class="tabi-display tabi-destino-hero-name">{destino.nome}</h1>
			<div class="tabi-jp tabi-destino-hero-jp">{destino.nomejp}</div>
		</div>
	</header>

	<section class="tabi-destino-lead tabi-anim-in">
		<p class="tabi-destino-desc">{destino.descricao}</p>
		<div class="tabi-destino-meta-strip">
			<div class="tabi-destino-meta-item">
				<span class="tabi-destino-meta-label">Melhor época</span>
				<span class="tabi-destino-meta-value"
					>{destino.melhorEpoca.map((e: string) => epocaLabel[e]).join(' · ')}</span
				>
			</div>
			<div class="tabi-destino-meta-item">
				<span class="tabi-destino-meta-label">Custo diário</span>
				<span class="tabi-destino-meta-value">{budgetLabel(destino.custoDiario)}</span>
			</div>
		</div>
	</section>

	{#if atracoes.length > 0}
		<section class="tabi-destino-section">
			<header class="tabi-destino-section-header">
				<div class="tabi-eyebrow">O que ver</div>
				<h2 class="tabi-display tabi-destino-section-title">Atrações</h2>
			</header>
			<div class="tabi-destino-cards">
				{#each atracoes as ativ (ativ.id)}
					<article class="tabi-destino-ativ tabi-anim-in">
						<header class="tabi-destino-ativ-header">
							<h3 class="tabi-destino-ativ-nome">{ativ.nome}</h3>
							<div class="tabi-destino-ativ-chips">
								<span class="tabi-chip">{tipoLabel[ativ.tipo]}</span>
								<span class="tabi-chip">{horarioLabel[ativ.melhorHorario]}</span>
								<span class="tabi-chip">{ativ.duracao}h</span>
								<span class="tabi-chip">{custoLabel[ativ.custo]}</span>
							</div>
						</header>
						<p class="tabi-destino-ativ-desc">{ativ.descricao}</p>
						{#if ativ.dica}
							<div class="tabi-destino-ativ-dica">
								<span class="tabi-destino-ativ-dica-tag tabi-jp">tip</span>
								<p>{ativ.dica}</p>
							</div>
						{/if}
					</article>
				{/each}
			</div>
		</section>
	{/if}

	{#if gastronomia.length > 0 || restaurantes.length > 0}
		<section class="tabi-destino-section">
			<header class="tabi-destino-section-header">
				<div class="tabi-eyebrow">Onde comer</div>
				<h2 class="tabi-display tabi-destino-section-title">Mesa & mercados</h2>
			</header>

			{#if gastronomia.length > 0}
				<div class="tabi-destino-cards">
					{#each gastronomia as ativ (ativ.id)}
						<article class="tabi-destino-ativ tabi-anim-in">
							<header class="tabi-destino-ativ-header">
								<h3 class="tabi-destino-ativ-nome">{ativ.nome}</h3>
								<div class="tabi-destino-ativ-chips">
									<span class="tabi-chip">{tipoLabel[ativ.tipo]}</span>
									<span class="tabi-chip">{horarioLabel[ativ.melhorHorario]}</span>
									<span class="tabi-chip">{custoLabel[ativ.custo]}</span>
								</div>
							</header>
							<p class="tabi-destino-ativ-desc">{ativ.descricao}</p>
							{#if ativ.dica}
								<div class="tabi-destino-ativ-dica">
									<span class="tabi-destino-ativ-dica-tag tabi-jp">tip</span>
									<p>{ativ.dica}</p>
								</div>
							{/if}
						</article>
					{/each}
				</div>
			{/if}

			{#if restaurantes.length > 0}
				<div class="tabi-rest-list">
					<div class="tabi-eyebrow tabi-rest-eyebrow">Restaurantes recomendados</div>
					{#each restaurantes as rest (rest.id)}
						<article class="tabi-rest tabi-anim-in">
							<div class="tabi-rest-main">
								<div class="tabi-rest-titlerow">
									<h4 class="tabi-rest-nome">{rest.nome}</h4>
									<span class="tabi-rest-preco tabi-jp">{rest.precoMedio}</span>
								</div>
								<div class="tabi-rest-sub">
									<span class="tabi-rest-especialidade">{rest.especialidade}</span>
									<span class="tabi-rest-bairro">· {rest.bairro}</span>
								</div>
								{#if rest.notaLocal}
									<p class="tabi-rest-nota">{rest.notaLocal}</p>
								{/if}
							</div>
						</article>
					{/each}
				</div>
			{/if}
		</section>
	{/if}

	{#if compras.length > 0}
		<section class="tabi-destino-section">
			<header class="tabi-destino-section-header">
				<div class="tabi-eyebrow">Comércio e ruas</div>
				<h2 class="tabi-display tabi-destino-section-title">Compras</h2>
			</header>
			<div class="tabi-destino-cards">
				{#each compras as ativ (ativ.id)}
					<article class="tabi-destino-ativ tabi-anim-in">
						<header class="tabi-destino-ativ-header">
							<h3 class="tabi-destino-ativ-nome">{ativ.nome}</h3>
							<div class="tabi-destino-ativ-chips">
								<span class="tabi-chip">{tipoLabel[ativ.tipo]}</span>
								<span class="tabi-chip">{horarioLabel[ativ.melhorHorario]}</span>
								<span class="tabi-chip">{ativ.duracao}h</span>
							</div>
						</header>
						<p class="tabi-destino-ativ-desc">{ativ.descricao}</p>
						{#if ativ.dica}
							<div class="tabi-destino-ativ-dica">
								<span class="tabi-destino-ativ-dica-tag tabi-jp">tip</span>
								<p>{ativ.dica}</p>
							</div>
						{/if}
					</article>
				{/each}
			</div>
		</section>
	{/if}

	<section class="tabi-destino-section tabi-destino-tip-section">
		<div class="tabi-destino-tip-card">
			<div class="tabi-eyebrow">Dica do local</div>
			<p class="tabi-destino-tip-text">{destino.dicaLocal}</p>
		</div>
	</section>

	<footer class="tabi-destino-footer">
		<button type="button" class="tabi-btn tabi-btn-ghost" onclick={voltar}>
			← Voltar aos resultados
		</button>
	</footer>
</main>

<style>
	.tabi-destino-page {
		flex: 1;
		max-width: 64rem;
		margin: 0 auto;
		padding: 0 1.25rem 5rem;
		display: flex;
		flex-direction: column;
		gap: 3rem;
	}

	/* Hero */
	.tabi-destino-hero {
		position: relative;
		width: calc(100% + 2.5rem);
		margin: 0 -1.25rem;
		height: clamp(20rem, 50vh, 32rem);
		overflow: hidden;
	}
	.tabi-destino-hero-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.tabi-destino-hero-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, rgba(37, 42, 56, 0.1) 0%, rgba(37, 42, 56, 0.7) 100%);
	}
	.tabi-destino-hero-kanji {
		position: absolute;
		top: 1.5rem;
		left: 1.5rem;
		font-size: clamp(7rem, 18vw, 14rem);
		line-height: 0.9;
		font-weight: 800;
		color: var(--color-cream);
		opacity: 0.85;
		text-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
		pointer-events: none;
	}
	.tabi-destino-hero-text {
		position: absolute;
		left: 1.5rem;
		right: 1.5rem;
		bottom: 1.5rem;
		color: var(--color-cream);
	}
	.tabi-destino-hero-text .tabi-eyebrow {
		color: color-mix(in oklch, var(--color-cream) 75%, var(--color-sage));
	}
	.tabi-destino-hero-name {
		font-size: clamp(2.25rem, 6vw, 4rem);
		margin: 0.4rem 0 0.25rem;
		color: var(--color-cream);
	}
	.tabi-destino-hero-jp {
		font-size: 1.125rem;
		letter-spacing: 0.1em;
		color: color-mix(in oklch, var(--color-cream) 80%, var(--color-sage));
	}

	/* Lead */
	.tabi-destino-lead {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		max-width: 44rem;
	}
	.tabi-destino-desc {
		font-size: 1.125rem;
		line-height: 1.7;
		color: color-mix(in oklch, var(--color-navy) 85%, var(--color-cream));
		margin: 0;
	}
	.tabi-destino-meta-strip {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem 2rem;
		padding: 1rem 0;
		border-top: 1px solid color-mix(in oklch, var(--color-navy) 12%, transparent);
		border-bottom: 1px solid color-mix(in oklch, var(--color-navy) 12%, transparent);
	}
	.tabi-destino-meta-item {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}
	.tabi-destino-meta-label {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: color-mix(in oklch, var(--color-navy) 55%, var(--color-cream));
	}
	.tabi-destino-meta-value {
		font-weight: 500;
		color: var(--color-navy);
	}

	/* Section */
	.tabi-destino-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
	.tabi-destino-section-header {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.tabi-destino-section-title {
		font-size: clamp(1.625rem, 3.5vw, 2.25rem);
		margin: 0;
		color: var(--color-navy);
	}

	/* Atividade card */
	.tabi-destino-cards {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}
	@media (min-width: 720px) {
		.tabi-destino-cards {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	.tabi-destino-ativ {
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
		padding: 1.25rem 1.25rem 1.5rem;
		background-color: color-mix(in oklch, var(--color-cream) 80%, white);
		border: 1px solid color-mix(in oklch, var(--color-navy) 12%, transparent);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-sm);
	}
	.tabi-destino-ativ-header {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.tabi-destino-ativ-nome {
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-navy);
		margin: 0;
		line-height: 1.2;
	}
	.tabi-destino-ativ-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}
	.tabi-chip {
		display: inline-flex;
		align-items: center;
		padding: 0.18rem 0.65rem;
		background-color: color-mix(in oklch, var(--color-sage) 16%, transparent);
		color: var(--color-navy);
		border-radius: var(--radius-full);
		font-size: 0.75rem;
		font-weight: 500;
		letter-spacing: 0.02em;
	}
	.tabi-destino-ativ-desc {
		font-size: 0.9375rem;
		line-height: 1.6;
		color: color-mix(in oklch, var(--color-navy) 80%, var(--color-cream));
		margin: 0;
	}
	.tabi-destino-ativ-dica {
		display: flex;
		gap: 0.875rem;
		padding: 0.75rem 1rem;
		background-color: color-mix(in oklch, var(--color-sage) 14%, transparent);
		border-left: 3px solid var(--color-sage);
		border-radius: var(--radius-sm);
		font-size: 0.8125rem;
		line-height: 1.55;
	}
	.tabi-destino-ativ-dica p {
		margin: 0;
		color: var(--color-navy);
	}
	.tabi-destino-ativ-dica-tag {
		flex-shrink: 0;
		font-size: 0.6875rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--color-sage);
		padding-top: 0.1rem;
	}

	/* Restaurants list */
	.tabi-rest-list {
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
		margin-top: 1rem;
	}
	.tabi-rest-eyebrow {
		margin-bottom: 0.25rem;
	}
	.tabi-rest {
		padding: 1rem 1.125rem;
		background-color: color-mix(in oklch, var(--color-cream) 70%, white);
		border: 1px solid color-mix(in oklch, var(--color-navy) 10%, transparent);
		border-radius: var(--radius-md);
	}
	.tabi-rest-main {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}
	.tabi-rest-titlerow {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
	}
	.tabi-rest-nome {
		font-family: var(--font-display);
		font-size: 1.0625rem;
		font-weight: 700;
		color: var(--color-navy);
		margin: 0;
	}
	.tabi-rest-preco {
		flex-shrink: 0;
		color: var(--color-red);
		font-weight: 600;
		font-size: 0.8125rem;
		letter-spacing: 0.02em;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
	}
	.tabi-rest-sub {
		font-size: 0.8125rem;
		color: color-mix(in oklch, var(--color-navy) 60%, var(--color-cream));
	}
	.tabi-rest-especialidade {
		font-weight: 500;
	}
	.tabi-rest-bairro {
		font-style: italic;
	}
	.tabi-rest-nota {
		margin: 0.4rem 0 0;
		font-size: 0.875rem;
		line-height: 1.55;
		color: color-mix(in oklch, var(--color-navy) 78%, var(--color-cream));
	}

	/* Tip section (final) */
	.tabi-destino-tip-section {
		max-width: 44rem;
	}
	.tabi-destino-tip-card {
		padding: 1.5rem 1.75rem;
		background-color: color-mix(in oklch, var(--color-sage) 16%, transparent);
		border-left: 4px solid var(--color-sage);
		border-radius: var(--radius-md);
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
	}
	.tabi-destino-tip-text {
		margin: 0;
		font-size: 1rem;
		line-height: 1.65;
		color: var(--color-navy);
	}

	/* Footer */
	.tabi-destino-footer {
		display: flex;
		justify-content: center;
		padding-top: 1rem;
	}
</style>

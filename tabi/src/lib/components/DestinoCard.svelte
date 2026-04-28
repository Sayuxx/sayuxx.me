<script lang="ts">
	import { base } from '$app/paths';
	import type { Destino } from '$lib/types';
	import { budgetLabel } from '$lib/matching';

	type Props = {
		destino: Destino;
		compatibility: number;
	};

	let { destino, compatibility }: Props = $props();

	const photo = $derived(
		`https://images.unsplash.com/photo-${destino.unsplashId}?w=800&auto=format&q=75&fit=crop`
	);

	const epocaLabel: Record<string, string> = {
		spring: 'primavera',
		summer: 'verão',
		autumn: 'outono',
		winter: 'inverno'
	};
</script>

<a class="tabi-destino-link tabi-anim-in" href="{base}/destino/{destino.id}">
	<article class="tabi-destino">
		<div class="tabi-destino-photo">
			<img src={photo} alt={destino.nome} loading="lazy" />
			<div class="tabi-destino-photo-overlay"></div>
			<span class="tabi-destino-kanji tabi-jp" aria-hidden="true">{destino.kanji}</span>
			<span class="tabi-destino-match">{compatibility}% match</span>
		</div>

		<div class="tabi-destino-body">
			<header class="tabi-destino-header">
				<div>
					<h3 class="tabi-destino-name tabi-display">{destino.nome}</h3>
					<div class="tabi-destino-jp tabi-jp">{destino.nomejp}</div>
				</div>
			</header>

			<p class="tabi-destino-desc">{destino.descricao}</p>

			<div class="tabi-destino-meta">
				<div class="tabi-destino-meta-row">
					<span class="tabi-destino-meta-label">Melhor época</span>
					<span class="tabi-destino-meta-value">
						{destino.melhorEpoca.map((e) => epocaLabel[e]).join(' · ')}
					</span>
				</div>
				<div class="tabi-destino-meta-row">
					<span class="tabi-destino-meta-label">Custo diário</span>
					<span class="tabi-destino-meta-value">{budgetLabel(destino.custoDiario)}</span>
				</div>
			</div>

			<div>
				<div class="tabi-destino-pontos-label tabi-eyebrow">Pontos principais</div>
				<ul class="tabi-destino-pontos">
					{#each destino.pontosPrincipais as ponto (ponto)}
						<li>{ponto}</li>
					{/each}
				</ul>
			</div>

			<div class="tabi-destino-dica">
				<span class="tabi-destino-dica-tag tabi-jp">tip</span>
				<p>{destino.dicaLocal}</p>
			</div>

			<span class="tabi-destino-explorar">
				Explorar {destino.nome}
				<span aria-hidden="true">→</span>
			</span>
		</div>
	</article>
</a>

<style>
	.tabi-destino-link {
		display: block;
		text-decoration: none;
		color: inherit;
		border-radius: var(--radius-lg);
	}
	.tabi-destino-link:focus-visible {
		outline: none;
		box-shadow: var(--ring-red);
	}
	.tabi-destino {
		position: relative;
		display: flex;
		flex-direction: column;
		background-color: color-mix(in oklch, var(--color-cream) 80%, white);
		border: 1px solid color-mix(in oklch, var(--color-navy) 12%, transparent);
		border-radius: var(--radius-lg);
		overflow: hidden;
		box-shadow: var(--shadow-sm);
		transition:
			transform 220ms var(--ease-out),
			box-shadow 220ms var(--ease-out),
			border-color 220ms var(--ease-out);
	}
	.tabi-destino-link:hover .tabi-destino {
		transform: translateY(-4px);
		border-color: var(--color-red);
		box-shadow: var(--shadow-lg);
	}
	.tabi-destino-photo {
		position: relative;
		aspect-ratio: 4 / 3;
		overflow: hidden;
		background-color: var(--color-sage);
	}
	.tabi-destino-photo img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 600ms var(--ease-out);
	}
	.tabi-destino-link:hover .tabi-destino-photo img {
		transform: scale(1.04);
	}
	.tabi-destino-photo-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(180deg, transparent 50%, rgba(37, 42, 56, 0.6) 100%);
	}
	.tabi-destino-kanji {
		position: absolute;
		left: 1rem;
		top: 0.75rem;
		font-size: 3.5rem;
		font-weight: 800;
		line-height: 1;
		color: var(--color-cream);
		opacity: 0.9;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
	}
	.tabi-destino-match {
		position: absolute;
		right: 1rem;
		top: 1rem;
		padding: 0.3rem 0.75rem;
		background-color: var(--color-red);
		color: var(--color-cream);
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		border-radius: var(--radius-full);
		font-variant-numeric: tabular-nums;
	}
	.tabi-destino-body {
		padding: 1.25rem 1.25rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		flex: 1;
	}
	.tabi-destino-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}
	.tabi-destino-name {
		font-size: 1.5rem;
		margin: 0;
		color: var(--color-navy);
	}
	.tabi-destino-jp {
		font-size: 0.875rem;
		color: var(--color-sage);
		letter-spacing: 0.08em;
		margin-top: 0.15rem;
	}
	.tabi-destino-desc {
		font-size: 0.9375rem;
		line-height: 1.6;
		color: color-mix(in oklch, var(--color-navy) 80%, var(--color-cream));
		margin: 0;
	}
	.tabi-destino-meta {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		padding: 0.75rem 0;
		border-top: 1px solid color-mix(in oklch, var(--color-navy) 10%, transparent);
		border-bottom: 1px solid color-mix(in oklch, var(--color-navy) 10%, transparent);
	}
	.tabi-destino-meta-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
		font-size: 0.8125rem;
	}
	.tabi-destino-meta-label {
		color: color-mix(in oklch, var(--color-navy) 55%, var(--color-cream));
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}
	.tabi-destino-meta-value {
		color: var(--color-navy);
		font-weight: 500;
		text-align: right;
	}
	.tabi-destino-pontos-label {
		margin-bottom: 0.5rem;
	}
	.tabi-destino-pontos {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		font-size: 0.875rem;
		color: color-mix(in oklch, var(--color-navy) 80%, var(--color-cream));
	}
	.tabi-destino-pontos li {
		position: relative;
		padding-left: 1.1rem;
	}
	.tabi-destino-pontos li::before {
		content: '·';
		position: absolute;
		left: 0.25rem;
		top: -0.05rem;
		color: var(--color-red);
		font-weight: 700;
	}
	.tabi-destino-dica {
		display: flex;
		gap: 0.75rem;
		padding: 0.875rem 1rem;
		background-color: color-mix(in oklch, var(--color-sage) 14%, transparent);
		border-left: 3px solid var(--color-sage);
		border-radius: var(--radius-sm);
		font-size: 0.8125rem;
		line-height: 1.55;
		color: var(--color-navy);
	}
	.tabi-destino-dica p {
		margin: 0;
	}
	.tabi-destino-dica-tag {
		flex-shrink: 0;
		font-size: 0.6875rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--color-sage);
		padding-top: 0.1rem;
	}
	.tabi-destino-explorar {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		min-height: 44px;
		padding: 0.625rem 1rem;
		font-family: var(--font-sans);
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--color-navy);
		background-color: transparent;
		border: 1.5px solid color-mix(in oklch, var(--color-navy) 22%, transparent);
		border-radius: var(--radius-full);
		transition:
			background-color 200ms var(--ease-out),
			color 200ms var(--ease-out),
			border-color 200ms var(--ease-out);
	}
	.tabi-destino-link:hover .tabi-destino-explorar {
		background-color: var(--color-red);
		border-color: var(--color-red);
		color: var(--color-cream);
	}
</style>

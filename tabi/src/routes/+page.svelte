<script lang="ts">
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import KanjiDecoration from '$lib/components/KanjiDecoration.svelte';
	import PatternBackground from '$lib/components/PatternBackground.svelte';
	import { quiz } from '$lib/state/quiz.svelte';

	function start() {
		quiz.reset();
		goto(`${base}/quiz`);
	}
</script>

<svelte:head>
	<title>Tabi · Descubra seu Japão</title>
	<meta
		name="description"
		content="Quiz de personalidade de viagem para o Japão. Descubra seu perfil de viajante e os destinos que mais combinam com você."
	/>
</svelte:head>

<main class="tabi-landing">
	<PatternBackground opacity={0.06} />

	<div class="tabi-landing-kanji-wrap">
		<KanjiDecoration char="旅" size="min(85vmin, 46rem)" opacity={0.10} />
	</div>

	<div class="tabi-landing-content tabi-stagger">
		<div class="tabi-eyebrow">tabi · 旅</div>

		<h1 class="tabi-display tabi-landing-title">
			Descubra <em>seu</em> Japão.
		</h1>

		<p class="tabi-landing-subtitle tabi-jp">
			あなたに合った日本の旅
		</p>

		<p class="tabi-landing-lede">
			Oito perguntas, um perfil de viajante, uma lista de destinos casados com o seu jeito de
			viajar. 
		</p>

		<div class="tabi-landing-cta">
			<button type="button" class="tabi-btn tabi-btn-primary" onclick={start}>
				Descubra seu Japão
				<span aria-hidden="true">→</span>
			</button>
			<span class="tabi-landing-meta">~ 2 min · 8 perguntas</span>
		</div>

		<div class="tabi-landing-steps">
			<div class="tabi-landing-step">
				<span class="tabi-landing-step-num tabi-jp">一</span>
				<div>
					<div class="tabi-landing-step-title">Responda o quiz</div>
					<div class="tabi-landing-step-desc">8 perguntas sobre seu jeito de viajar.</div>
				</div>
			</div>
			<div class="tabi-landing-step">
				<span class="tabi-landing-step-num tabi-jp">二</span>
				<div>
					<div class="tabi-landing-step-title">Receba seu perfil</div>
					<div class="tabi-landing-step-desc">Uma persona de viajante feita pra você.</div>
				</div>
			</div>
			<div class="tabi-landing-step">
				<span class="tabi-landing-step-num tabi-jp">三</span>
				<div>
					<div class="tabi-landing-step-title">Explore destinos</div>
					<div class="tabi-landing-step-desc">Cidades casadas com o seu perfil.</div>
				</div>
			</div>
		</div>
	</div>
</main>

<style>
	.tabi-landing {
		position: relative;
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 4rem 1.5rem;
		overflow: hidden;
	}
	.tabi-landing-kanji-wrap {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
	}
	.tabi-landing-content {
		position: relative;
		z-index: 2;
		max-width: 42rem;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}
	.tabi-landing-title {
		font-size: clamp(2.75rem, 8vw, 5rem);
		margin: 0.5rem 0 0;
		color: var(--color-navy);
	}
	.tabi-landing-title em {
		font-style: normal;
		color: var(--color-red);
	}
	.tabi-landing-subtitle {
		font-size: 1.125rem;
		color: var(--color-sage);
		letter-spacing: 0.1em;
		margin: 0;
	}
	.tabi-landing-lede {
		max-width: 32rem;
		font-size: 1.0625rem;
		line-height: 1.7;
		color: color-mix(in oklch, var(--color-navy) 80%, var(--color-cream));
		margin: 0.5rem 0;
	}
	.tabi-landing-cta {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.625rem;
		margin-top: 0.5rem;
	}
	.tabi-landing-meta {
		font-size: 0.8125rem;
		color: color-mix(in oklch, var(--color-navy) 55%, var(--color-cream));
		letter-spacing: 0.04em;
	}
	.tabi-landing-steps {
		display: grid;
		gap: 1rem;
		grid-template-columns: 1fr;
		margin-top: 2rem;
		width: 100%;
		max-width: 36rem;
	}
	@media (min-width: 720px) {
		.tabi-landing-steps {
			grid-template-columns: repeat(3, 1fr);
		}
	}
	.tabi-landing-step {
		display: flex;
		align-items: center;
		gap: 0.875rem;
		padding: 1rem 1.125rem;
		background-color: color-mix(in oklch, var(--color-cream) 60%, white);
		border: 1px solid color-mix(in oklch, var(--color-navy) 10%, transparent);
		border-radius: var(--radius-md);
		text-align: left;
	}
	.tabi-landing-step-num {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-red);
		line-height: 1;
		min-width: 1.5rem;
	}
	.tabi-landing-step-title {
		font-weight: 600;
		font-size: 0.9375rem;
		color: var(--color-navy);
	}
	.tabi-landing-step-desc {
		font-size: 0.8125rem;
		color: color-mix(in oklch, var(--color-navy) 65%, var(--color-cream));
		margin-top: 0.15rem;
	}
</style>

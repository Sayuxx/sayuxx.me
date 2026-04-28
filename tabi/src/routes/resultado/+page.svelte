<script lang="ts">
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { quiz } from '$lib/state/quiz.svelte';
	import { pickPersona, rankDestinos, scoreRespostas, budgetLabel } from '$lib/matching';
	import PersonaReveal from '$lib/components/PersonaReveal.svelte';
	import DestinoCard from '$lib/components/DestinoCard.svelte';
	import FloatingPetals from '$lib/components/FloatingPetals.svelte';

	let ready = $state(false);

	onMount(() => {
		quiz.hydrate();
		if (quiz.respostas.length === 0) {
			goto(`${base}/`);
			return;
		}
		ready = true;
	});

	const score = $derived(scoreRespostas(quiz.respostas));
	const persona = $derived(ready ? pickPersona(score.vector) : null);
	const matches = $derived(ready ? rankDestinos(score, 4) : []);

	function restart() {
		quiz.reset();
		goto(`${base}/`);
	}
</script>

<svelte:head>
	<title>Seu Japão · Tabi</title>
</svelte:head>

{#if ready && persona}
	<FloatingPetals count={14} />

	<main class="tabi-resultado">
		<PersonaReveal {persona} />

		<section class="tabi-destinos-section">
			<header class="tabi-destinos-header">
				<div class="tabi-eyebrow">Seus destinos ideais</div>
				<h2 class="tabi-display tabi-destinos-title">Comece por aqui.</h2>
				<p class="tabi-destinos-meta">
					Faixa de orçamento: <strong>{budgetLabel(score.budget)}</strong> ·
					{matches.length} cidades casadas com o seu perfil.
				</p>
			</header>

			<div class="tabi-destinos-grid">
				{#each matches as match (match.destino.id)}
					<DestinoCard destino={match.destino} compatibility={match.compatibility} />
				{/each}
			</div>
		</section>

		<section class="tabi-resultado-restart">
			<p class="tabi-resultado-restart-label">Quer outro perfil?</p>
			<button type="button" class="tabi-btn tabi-btn-ghost" onclick={restart}>
				↺ Refazer quiz
			</button>
		</section>
	</main>
{:else}
	<main class="tabi-resultado-loading">
		<p>Carregando seu perfil…</p>
	</main>
{/if}

<style>
	.tabi-resultado {
		flex: 1;
		max-width: 72rem;
		margin: 0 auto;
		padding: 3rem 1.5rem 5rem;
		display: flex;
		flex-direction: column;
		gap: 4rem;
		position: relative;
		z-index: 2;
	}
	.tabi-destinos-section {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
	.tabi-destinos-header {
		text-align: center;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.tabi-destinos-title {
		font-size: clamp(1.875rem, 4vw, 2.5rem);
		margin: 0;
		color: var(--color-navy);
	}
	.tabi-destinos-meta {
		color: color-mix(in oklch, var(--color-navy) 70%, var(--color-cream));
		margin: 0;
		font-size: 0.9375rem;
	}
	.tabi-destinos-meta strong {
		color: var(--color-red);
		font-weight: 600;
	}
	.tabi-destinos-grid {
		display: grid;
		gap: 1.5rem;
		grid-template-columns: 1fr;
		max-width: 56rem;
		margin: 0 auto;
	}
	@media (min-width: 720px) {
		.tabi-destinos-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	.tabi-resultado-restart {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.875rem;
		padding-top: 1rem;
	}
	.tabi-resultado-restart-label {
		margin: 0;
		font-size: 0.875rem;
		color: color-mix(in oklch, var(--color-navy) 60%, var(--color-cream));
	}
	.tabi-resultado-loading {
		flex: 1;
		display: grid;
		place-items: center;
		color: color-mix(in oklch, var(--color-navy) 60%, var(--color-cream));
	}
</style>

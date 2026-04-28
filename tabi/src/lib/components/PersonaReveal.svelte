<script lang="ts">
	import type { Persona } from '$lib/types';

	type Props = {
		persona: Persona;
	};

	let { persona }: Props = $props();
</script>

<section class="tabi-persona tabi-anim-reveal">
	<div class="tabi-persona-eyebrow tabi-eyebrow">Seu perfil de viajante</div>

	<div class="tabi-persona-kanji-wrap" aria-hidden="true">
		<span class="tabi-persona-kanji tabi-jp">{persona.kanji}</span>
	</div>

	<h1 class="tabi-persona-name tabi-display">{persona.nome}</h1>
	<div class="tabi-persona-jp tabi-jp">{persona.nomejp}</div>
	<p class="tabi-persona-desc">{persona.descricao}</p>
</section>

<style>
	.tabi-persona {
		position: relative;
		text-align: center;
		max-width: 38rem;
		margin: 0 auto;
		padding: 2rem 1.5rem;
	}
	.tabi-persona-eyebrow {
		margin-bottom: 1rem;
	}
	.tabi-persona-kanji-wrap {
		position: relative;
		height: 12rem;
		display: grid;
		place-items: center;
		margin-bottom: 0.5rem;
	}
	.tabi-persona-kanji {
		font-size: 12rem;
		line-height: 1;
		font-weight: 800;
		color: var(--color-red);
		text-shadow: 0 8px 24px rgba(186, 71, 74, 0.18);
	}
	.tabi-persona-name {
		font-size: clamp(2rem, 5vw, 2.75rem);
		margin: 0.5rem 0 0.875rem;
		color: var(--color-navy);
	}
	.tabi-persona-jp {
		font-size: 1.125rem;
		color: color-mix(in oklch, var(--color-navy) 55%, var(--color-cream));
		letter-spacing: 0.1em;
	}
	.tabi-persona-desc {
		margin-top: 1.25rem;
		font-size: 1.0625rem;
		line-height: 1.65;
		color: color-mix(in oklch, var(--color-navy) 80%, var(--color-cream));
	}
</style>

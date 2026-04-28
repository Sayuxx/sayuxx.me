<script lang="ts">
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { quiz } from '$lib/state/quiz.svelte';
	import QuizCard from '$lib/components/QuizCard.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';

	const question = $derived(quiz.currentQuestion);
	const selected = $derived(quiz.selectedFor(question.id));
	const isLast = $derived(quiz.currentIndex === quiz.total - 1);

	function handleSelect(optionId: string) {
		quiz.answer(question.id, optionId);
		setTimeout(() => {
			if (isLast) {
				goto(`${base}/resultado`);
			} else {
				quiz.next();
			}
		}, 220);
	}

	function handlePrev() {
		quiz.prev();
	}
</script>

<svelte:head>
	<title>Quiz · Tabi</title>
</svelte:head>

<main class="tabi-quiz-page">
	<div class="tabi-quiz-shell">
		<header class="tabi-quiz-header">
			<a class="tabi-quiz-back" href="{base}/" aria-label="Voltar para o início">← início</a>
			<ProgressBar value={quiz.respostas.length} max={quiz.total} />
		</header>

		{#key question.id}
			<section class="tabi-quiz-question tabi-anim-in" aria-live="polite">
				<div class="tabi-quiz-step tabi-eyebrow">
					Pergunta {quiz.currentIndex + 1} de {quiz.total}
				</div>
				<h2 class="tabi-display tabi-quiz-prompt">{question.prompt}</h2>
				{#if question.hint}
					<p class="tabi-quiz-hint">{question.hint}</p>
				{/if}

				<div class="tabi-quiz-options">
					{#each question.options as opt (opt.id)}
						<QuizCard
							icon={opt.icon}
							label={opt.label}
							description={opt.description}
							selected={selected === opt.id}
							onclick={() => handleSelect(opt.id)}
						/>
					{/each}
				</div>
			</section>
		{/key}

		<footer class="tabi-quiz-footer">
			<button
				type="button"
				class="tabi-btn tabi-btn-ghost"
				onclick={handlePrev}
				disabled={quiz.currentIndex === 0}
			>
				← Voltar
			</button>
			<div class="tabi-quiz-skip">
				{#if selected}
					<span>Selecionado · avançando…</span>
				{:else}
					<span>Toque numa opção para continuar</span>
				{/if}
			</div>
		</footer>
	</div>
</main>

<style>
	.tabi-quiz-page {
		flex: 1;
		display: flex;
		justify-content: center;
		padding: 2rem 1.25rem 4rem;
	}
	.tabi-quiz-shell {
		width: 100%;
		max-width: 38rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
	.tabi-quiz-header {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	.tabi-quiz-back {
		font-size: 0.8125rem;
		color: color-mix(in oklch, var(--color-navy) 60%, var(--color-cream));
		text-decoration: none;
		white-space: nowrap;
		padding: 0.4rem 0.6rem;
		border-radius: var(--radius-sm);
		transition: color 180ms var(--ease-out), background-color 180ms var(--ease-out);
	}
	.tabi-quiz-back:hover {
		color: var(--color-navy);
		background-color: color-mix(in oklch, var(--color-navy) 6%, transparent);
	}
	.tabi-quiz-question {
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
	}
	.tabi-quiz-step {
		color: var(--color-sage);
	}
	.tabi-quiz-prompt {
		font-size: clamp(1.625rem, 4vw, 2.25rem);
		margin: 0.25rem 0 0;
		color: var(--color-navy);
		line-height: 1.15;
	}
	.tabi-quiz-hint {
		font-size: 0.9375rem;
		color: color-mix(in oklch, var(--color-navy) 65%, var(--color-cream));
		margin: 0;
	}
	.tabi-quiz-options {
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
		margin-top: 1.25rem;
	}
	.tabi-quiz-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		padding-top: 1rem;
		border-top: 1px solid color-mix(in oklch, var(--color-navy) 10%, transparent);
	}
	.tabi-quiz-skip {
		font-size: 0.8125rem;
		color: color-mix(in oklch, var(--color-navy) 50%, var(--color-cream));
	}
</style>

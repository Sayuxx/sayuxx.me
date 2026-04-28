<script lang="ts">
	type Props = {
		icon: string;
		label: string;
		description?: string;
		selected?: boolean;
		onclick?: () => void;
	};

	let { icon, label, description, selected = false, onclick }: Props = $props();
</script>

<button
	type="button"
	class="tabi-quiz-card"
	aria-pressed={selected}
	onclick={onclick}
>
	<span class="tabi-quiz-icon" aria-hidden="true">{icon}</span>
	<span class="tabi-quiz-text">
		<span class="tabi-quiz-label">{label}</span>
		{#if description}
			<span class="tabi-quiz-desc">{description}</span>
		{/if}
	</span>
</button>

<style>
	.tabi-quiz-icon {
		font-size: 1.5rem;
		line-height: 1;
		flex-shrink: 0;
		display: grid;
		place-items: center;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: var(--radius-md);
		background-color: color-mix(in oklch, var(--color-sage) 18%, transparent);
	}
	.tabi-quiz-text {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		flex: 1;
	}
	.tabi-quiz-label {
		font-weight: 600;
		font-size: 0.9375rem;
		line-height: 1.3;
	}
	.tabi-quiz-desc {
		font-size: 0.8125rem;
		line-height: 1.45;
		color: color-mix(in oklch, var(--color-navy) 65%, var(--color-cream));
	}
</style>

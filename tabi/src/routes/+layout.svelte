<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { quiz } from '$lib/state/quiz.svelte';

	let { children } = $props();

	onMount(() => {
		quiz.hydrate();
	});
</script>

<div class="tabi-shell">
	{@render children()}
</div>

<style>
	:global(.tabi-shell) {
		position: relative;
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
	}
</style>

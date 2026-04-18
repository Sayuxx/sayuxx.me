<script lang="ts">
	import '../app.css';
	import { theme, applyTheme } from '$lib/stores/theme';

	let { children } = $props();

	$effect(() => {
		applyTheme($theme);
	});
</script>

{@render children()}

<script lang="ts">
	import { theme, toggleTheme } from '$lib/stores/theme';
	import Icon from './Icon.svelte';
</script>

<button
	onclick={toggleTheme}
	class="tx-icon-btn-float tx-icon-btn"
	title={$theme === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro'}
	aria-label="Alternar tema"
>
	{#if $theme === 'light'}
		<Icon name="theme-moon" size={18} />
	{:else}
		<Icon name="theme-sun" size={18} />
	{/if}
</button>

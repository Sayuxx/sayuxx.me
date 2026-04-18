<script lang="ts">
	import SettingsForm from '$lib/components/SettingsForm.svelte';
	import ShiftForm from '$lib/components/ShiftForm.svelte';
	import ShiftList from '$lib/components/ShiftList.svelte';
	import SalarySummary from '$lib/components/SalarySummary.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import ModeTabs from '$lib/components/ModeTabs.svelte';
	import TemplateForm from '$lib/components/TemplateForm.svelte';
	import { shifts, clearShifts } from '$lib/stores/shifts';
	import { mode } from '$lib/stores/mode';
</script>

<svelte:head>
	<title>給料計算 · Calculadora de salário (Japão)</title>
	<meta name="description" content="Calcule seu salário bruto do mês no Japão — horas extras, adicional noturno, feriado legal e overtime >60h/mês." />
</svelte:head>

<div class="mx-auto min-h-screen max-w-4xl bg-ctp-base px-4 py-6">
	<header class="mb-6 flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-ctp-text">給料計算</h1>
			<p class="mt-1 text-ctp-subtext0">Calculadora de salário bruto — Japão</p>
		</div>
		<ThemeToggle />
	</header>

	<div class="space-y-4">
		<SettingsForm />
		<ModeTabs />

		{#if $mode === 'template'}
			<TemplateForm />
		{:else}
			<ShiftForm />
		{/if}

		{#if $shifts.length > 0}
			<div class="flex items-center justify-end">
				<button
					onclick={() => clearShifts()}
					class="rounded px-3 py-1 text-sm text-ctp-red hover:bg-ctp-surface0"
				>
					Limpar todos os turnos
				</button>
			</div>
		{/if}

		<ShiftList />
		<SalarySummary />
	</div>

	<footer class="mt-8 border-t border-ctp-surface1 pt-4 text-center text-xs text-ctp-overlay0">
		<p>Estimativa bruta. Não inclui 社会保険, 所得税 ou 住民税.</p>
		<p class="mt-1">給料計算 &copy; {new Date().getFullYear()}</p>
	</footer>
</div>

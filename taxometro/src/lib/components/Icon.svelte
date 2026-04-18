<script lang="ts">
	export type IconName =
		| 'brand-mark'
		| 'theme-sun'
		| 'theme-moon'
		| 'refresh'
		| 'pin-location'
		| 'chevron-down'
		| 'chevron-right'
		| 'plus'
		| 'trash'
		| 'edit-pencil'
		| 'cart-empty'
		| 'shipping-truck'
		| 'bolt'
		| 'paper-plane'
		| 'receipt'
		| 'info';

	interface Props {
		name: IconName;
		size?: number | string;
		strokeWidth?: number;
		class?: string;
	}

	let { name, size = 16, strokeWidth, class: klass = '' }: Props = $props();

	const defaultStroke: Record<IconName, number> = {
		'brand-mark': 2,
		'theme-sun': 2,
		'theme-moon': 2,
		'refresh': 2.2,
		'pin-location': 2,
		'chevron-down': 2.2,
		'chevron-right': 2.4,
		'plus': 2.4,
		'trash': 2,
		'edit-pencil': 2,
		'cart-empty': 1.8,
		'shipping-truck': 2,
		'bolt': 2.2,
		'paper-plane': 2.2,
		'receipt': 2.2,
		'info': 2
	};

	const sw = $derived(strokeWidth ?? defaultStroke[name]);
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width={sw}
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
	class={klass}
>
	{#if name === 'brand-mark'}
		<path d="M12 2v3" />
		<path d="M5.64 5.64 7.76 7.76" />
		<path d="M2 12h3" />
		<path d="M19 12h3" />
		<path d="M16.24 7.76 18.36 5.64" />
		<circle cx="12" cy="14" r="6" />
		<path d="M12 14v-2" />
		<path d="m12 14 3.5-2" />
	{:else if name === 'theme-sun'}
		<circle cx="12" cy="12" r="5" />
		<line x1="12" y1="1" x2="12" y2="3" />
		<line x1="12" y1="21" x2="12" y2="23" />
		<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
		<line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
		<line x1="1" y1="12" x2="3" y2="12" />
		<line x1="21" y1="12" x2="23" y2="12" />
		<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
		<line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
	{:else if name === 'theme-moon'}
		<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
	{:else if name === 'refresh'}
		<path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
		<path d="M21 3v5h-5" />
		<path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
		<path d="M3 21v-5h5" />
	{:else if name === 'pin-location'}
		<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
		<circle cx="12" cy="10" r="3" />
	{:else if name === 'chevron-down'}
		<polyline points="6 9 12 15 18 9" />
	{:else if name === 'chevron-right'}
		<polyline points="9 18 15 12 9 6" />
	{:else if name === 'plus'}
		<path d="M12 5v14" />
		<path d="M5 12h14" />
	{:else if name === 'trash'}
		<path d="M3 6h18" />
		<path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
		<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
	{:else if name === 'edit-pencil'}
		<path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
	{:else if name === 'cart-empty'}
		<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
		<path d="M3 6h18" />
		<path d="M16 10a4 4 0 0 1-8 0" />
	{:else if name === 'shipping-truck'}
		<path d="M5 18H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12v12Z" />
		<path d="M15 6h4.5a1 1 0 0 1 .86.5l2.14 3.8a1 1 0 0 1 .14.52V17a1 1 0 0 1-1 1h-2" />
		<circle cx="7" cy="18" r="2" />
		<circle cx="17" cy="18" r="2" />
	{:else if name === 'bolt'}
		<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
	{:else if name === 'paper-plane'}
		<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
	{:else if name === 'receipt'}
		<path d="M8 2v4" />
		<path d="M16 2v4" />
		<rect width="18" height="18" x="3" y="4" rx="2" />
		<path d="M3 10h18" />
	{:else if name === 'info'}
		<circle cx="12" cy="12" r="10" />
		<path d="M12 16v-4" />
		<path d="M12 8h.01" />
	{/if}
</svg>

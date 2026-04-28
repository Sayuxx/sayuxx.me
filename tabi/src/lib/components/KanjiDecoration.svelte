<script lang="ts">
	type Props = {
		char: string;
		size?: string;
		opacity?: number;
		class?: string;
	};

	let { char, size = '40vmin', opacity = 0.10, class: cls = '' }: Props = $props();
</script>

<span
	aria-hidden="true"
	class="tabi-kanji-deco {cls}"
	style="font-size: {size}; opacity: {opacity};"
>
	{char}
</span>

<script lang="ts">
	type Props = {
		opacity?: number;
		color?: string;
	};

	let { opacity = 0.08, color = 'currentColor' }: Props = $props();
</script>

<div class="tabi-pattern-bg" style="--pattern-opacity: {opacity}; --pattern-color: {color};">
	<svg
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		width="100%"
		height="100%"
		preserveAspectRatio="xMidYMid"
	>
		<defs>
			<pattern id="seigaiha" x="0" y="0" width="60" height="30" patternUnits="userSpaceOnUse">
				<g fill="none" stroke="var(--pattern-color)" stroke-width="1.2">
					<circle cx="30" cy="30" r="28" />
					<circle cx="30" cy="30" r="20" />
					<circle cx="30" cy="30" r="12" />
					<circle cx="30" cy="30" r="4" />
					<circle cx="0" cy="30" r="28" />
					<circle cx="60" cy="30" r="28" />
				</g>
			</pattern>
		</defs>
		<rect width="100%" height="100%" fill="url(#seigaiha)" />
	</svg>
</div>

<style>
	.tabi-pattern-bg {
		position: absolute;
		inset: 0;
		pointer-events: none;
		opacity: var(--pattern-opacity);
		color: var(--color-sage);
		z-index: 0;
		mask-image: linear-gradient(180deg, transparent 0%, black 30%, black 70%, transparent 100%);
		-webkit-mask-image: linear-gradient(
			180deg,
			transparent 0%,
			black 30%,
			black 70%,
			transparent 100%
		);
	}
</style>

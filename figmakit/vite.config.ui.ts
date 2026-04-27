import { defineConfig, type Plugin } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { fileURLToPath, URL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const renameToUiHtml = (): Plugin => ({
	name: 'rename-html-to-ui',
	closeBundle() {
		const outDir = fileURLToPath(new URL('./dist', import.meta.url));
		const from = path.join(outDir, 'index.html');
		const to = path.join(outDir, 'ui.html');
		if (fs.existsSync(from)) fs.renameSync(from, to);
	}
});

export default defineConfig({
	plugins: [svelte({ configFile: fileURLToPath(new URL('./svelte.config.js', import.meta.url)) }), viteSingleFile(), renameToUiHtml()],
	resolve: {
		alias: {
			$lib: fileURLToPath(new URL('./src/lib', import.meta.url))
		}
	},
	root: 'src/ui',
	build: {
		outDir: fileURLToPath(new URL('./dist', import.meta.url)),
		emptyOutDir: false,
		target: 'es2017',
		assetsInlineLimit: 100000000,
		cssCodeSplit: false,
		rollupOptions: {
			output: {
				entryFileNames: 'ui.js',
				assetFileNames: 'ui.[ext]'
			}
		}
	}
});

import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
	resolve: {
		alias: {
			$lib: fileURLToPath(new URL('./src/lib', import.meta.url))
		}
	},
	build: {
		outDir: 'dist',
		emptyOutDir: false,
		target: 'es2017',
		minify: false,
		lib: {
			entry: fileURLToPath(new URL('./src/code.ts', import.meta.url)),
			formats: ['iife'],
			name: 'figmakit',
			fileName: () => 'code.js'
		}
	}
});

#!/usr/bin/env node
/**
 * Refresh JPY→BRL and JPY→USD in rates.json from Banco Central do Brasil PTAX.
 *
 * Usado pelo app como fallback offline — o navegador já busca PTAX ao vivo em
 * runtime via services/bcb.ts. Workflow chama esse script 1×/dia depois da
 * janela de publicação do BCB. No fim de semana/feriado o PTAX não publica e
 * o script fica no-op silencioso.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const RATES_PATH = resolve(__dirname, '../src/lib/data/rates.json');

const BCB_API = 'https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata';

function fmtDate(d) {
	return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}-${d.getFullYear()}`;
}

async function fetchPtaxLatest(moeda) {
	const end = new Date();
	const start = new Date();
	start.setDate(end.getDate() - 10); // 10 days back to cover holidays + weekend
	const url =
		`${BCB_API}/CotacaoMoedaPeriodo(moeda=@m,dataInicial=@di,dataFinalCotacao=@df)` +
		`?@m='${moeda}'&@di='${fmtDate(start)}'&@df='${fmtDate(end)}'` +
		`&$orderby=dataHoraCotacao%20desc&$top=1&$format=json`;
	const res = await fetch(url);
	if (!res.ok) throw new Error(`BCB ${moeda}: HTTP ${res.status}`);
	const data = await res.json();
	if (!data.value?.length) throw new Error(`BCB ${moeda}: empty result`);
	return {
		rate: data.value[0].cotacaoVenda,
		date: data.value[0].dataHoraCotacao.split(' ')[0]
	};
}

// Round to 6 significant digits to avoid noisy commits from float jitter
const round = (n) => Number(n.toPrecision(6));

async function main() {
	const [usd, jpy] = await Promise.all([
		fetchPtaxLatest('USD'),
		fetchPtaxLatest('JPY')
	]);

	const usdToBrl = usd.rate;
	const jpyToBrl = jpy.rate;
	const jpyToUsd = jpyToBrl / usdToBrl;

	const newJpyToBrl = round(jpyToBrl);
	const newJpyToUsd = round(jpyToUsd);

	const rates = JSON.parse(await readFile(RATES_PATH, 'utf-8'));

	const changed =
		rates.exchangeRates.jpyToBrl !== newJpyToBrl ||
		rates.exchangeRates.jpyToUsd !== newJpyToUsd ||
		rates.exchangeRates.lastUpdated !== jpy.date;

	rates.exchangeRates.jpyToBrl = newJpyToBrl;
	rates.exchangeRates.jpyToUsd = newJpyToUsd;
	rates.exchangeRates.lastUpdated = jpy.date;

	if (changed) {
		await writeFile(RATES_PATH, JSON.stringify(rates, null, '\t') + '\n');
		console.log(
			`updated  jpyToBrl=${newJpyToBrl}  jpyToUsd=${newJpyToUsd}  ptax=${jpy.date}`
		);
	} else {
		console.log(`unchanged  jpyToBrl=${newJpyToBrl}  ptax=${jpy.date}`);
	}
}

main().catch((err) => {
	console.error('refresh-rates failed:', err.message);
	process.exit(1);
});

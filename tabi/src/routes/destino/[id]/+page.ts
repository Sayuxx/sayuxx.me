import { error } from '@sveltejs/kit';
import { DESTINOS, destinoById } from '$lib/data/destinos';
import { atividadesPorDestino } from '$lib/data/atividades';
import { restaurantesPorDestino } from '$lib/data/restaurantes';

export function entries() {
	return DESTINOS.map((d) => ({ id: d.id }));
}

export function load({ params }: { params: { id: string } }) {
	const destino = destinoById(params.id);
	if (!destino) {
		throw error(404, 'Destino não encontrado');
	}
	return {
		destino,
		atividades: atividadesPorDestino(destino.id),
		restaurantes: restaurantesPorDestino(destino.id)
	};
}

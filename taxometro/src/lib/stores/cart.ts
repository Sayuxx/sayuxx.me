import { writable, derived } from 'svelte/store';
import type { Product, ShippingMethod } from '$lib/calc/types';

export const products = writable<Product[]>([]);
export const selectedState = writable<string>('SP');
export const selectedShippingMethod = writable<ShippingMethod>('ems');
export const singlePackage = writable<boolean>(true);

let nextId = 1;

export function addProduct(product: Omit<Product, 'id'>): void {
	products.update((items) => [...items, { ...product, id: String(nextId++) }]);
}

export function removeProduct(id: string): void {
	products.update((items) => items.filter((p) => p.id !== id));
}

export function updateProduct(id: string, updates: Partial<Omit<Product, 'id'>>): void {
	products.update((items) =>
		items.map((p) => (p.id === id ? { ...p, ...updates } : p))
	);
}

export function clearCart(): void {
	products.set([]);
}

export const productCount = derived(products, ($products) => $products.length);

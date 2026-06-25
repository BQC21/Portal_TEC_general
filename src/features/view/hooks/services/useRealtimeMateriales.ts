"use client";

import { useCallback, useEffect, useState } from "react";

import {
	createMaterial,
	deleteMaterial,
	getMaterialById,
	getMaterialFilterOptions,
	getMateriales,
	updateMaterial,
} from "@/features/controller/services/materialesQueries";
import type {
	Materiales,
	MaterialesFormData,
	MaterialesFilterOptions,
	UseMaterialesMutationsResult,
	UseMaterialesResult,
} from "@/lib/types/supabase/materiales-types";

import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export function useMateriales(): UseMaterialesResult {
	const [materiales, setMateriales] = useState<Materiales[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchMateriales = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const data = await getMateriales();
			setMateriales(data);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Error al cargar los materiales";
			setError(message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		void fetchMateriales();
	}, [fetchMateriales]);

	useEffect(() => {
		const channelName = `materiales-realtime-${Date.now()}-${Math.random().toString(36).slice(2)}`;
		const channel = supabase
			.channel(channelName)
			.on(
				"postgres_changes",
				{ event: "INSERT", schema: "public", table: "materiales_electricos" },
				() => {
					void fetchMateriales();
				}
			)
			.on(
				"postgres_changes",
				{ event: "UPDATE", schema: "public", table: "materiales_electricos" },
				() => {
					void fetchMateriales();
				}
			)
			.on(
				"postgres_changes",
				{ event: "DELETE", schema: "public", table: "materiales_electricos" },
				() => {
					void fetchMateriales();
				}
			)
			.subscribe();

		return () => {
			void supabase.removeChannel(channel);
		};
	}, [fetchMateriales]);

	return {
		materiales,
		loading,
		error,
		refetch: fetchMateriales,
	};
}

export function useMaterialFilterOptions() {
	const [options, setOptions] = useState<MaterialesFilterOptions>({
		types: [],
		brands: [],
		suppliers: [],
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchOptions = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const data = await getMaterialFilterOptions();
			setOptions(data);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Error al cargar las opciones de filtro";
			setError(message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		void fetchOptions();
	}, [fetchOptions]);

	return {
		options,
		loading,
		error,
		refetch: fetchOptions,
	};
}

export function useMaterialMutations(): UseMaterialesMutationsResult {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const create = useCallback(async (material: MaterialesFormData) => {
		try {
			setLoading(true);
			setError(null);

			return await createMaterial(material);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Error al crear el material";
			setError(message);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const update = useCallback(async (id: string, material: MaterialesFormData) => {
		try {
			setLoading(true);
			setError(null);

			return await updateMaterial(id, material);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Error al actualizar el material";
			setError(message);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const remove = useCallback(async (id: string) => {
		try {
			setLoading(true);
			setError(null);

			await deleteMaterial(id);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Error al eliminar el material";
			setError(message);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	return {
		loading,
		error,
		create,
		update,
		remove,
	};
}

export async function getMaterialByIdService(id: string): Promise<Materiales> {
	return getMaterialById(id);
}

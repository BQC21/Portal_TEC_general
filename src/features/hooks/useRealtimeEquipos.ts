"use client";

import { useCallback, useEffect, useState } from "react";

import {
	createEquipo,
	deleteEquipo,
	getEquipoById,
	getEquipoFilterOptions,
	getEquipos,
	updateEquipo,
} from "@/features/controller/services/equiposQueries";
import type {
	Equipos,
	EquiposFormData,
	EquiposFilterOptions,
	UseEquiposMutationsResult,
	UseEquiposResult,
} from "@/lib/types/equipos-types";

import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export function useEquipos(): UseEquiposResult {
	const [equipos, setEquipos] = useState<Equipos[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchEquipos = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const data = await getEquipos();
			setEquipos(data);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Error al cargar los equipos";
			setError(message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		void fetchEquipos();
	}, [fetchEquipos]);

	useEffect(() => {
		const channelName = `equipos-realtime-${Date.now()}-${Math.random().toString(36).slice(2)}`;
		const channel = supabase
			.channel(channelName)
			.on(
				"postgres_changes",
				{ event: "INSERT", schema: "public", table: "equipo_principales" },
				() => {
					void fetchEquipos();
				}
			)
			.on(
				"postgres_changes",
				{ event: "UPDATE", schema: "public", table: "equipo_principales" },
				() => {
					void fetchEquipos();
				}
			)
			.on(
				"postgres_changes",
				{ event: "DELETE", schema: "public", table: "equipo_principales" },
				() => {
					void fetchEquipos();
				}
			)
			.subscribe();

		return () => {
			void supabase.removeChannel(channel);
		};
	}, [fetchEquipos]);

	return {
		equipos,
		loading,
		error,
		refetch: fetchEquipos,
	};
}

export function useEquipoFilterOptions() {
	const [options, setOptions] = useState<EquiposFilterOptions>({
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

			const data = await getEquipoFilterOptions();
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

export function useEquipoMutations(): UseEquiposMutationsResult {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const create = useCallback(async (equipo: EquiposFormData) => {
		try {
			setLoading(true);
			setError(null);

			return await createEquipo(equipo);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Error al crear el equipo";
			setError(message);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const update = useCallback(async (id: string, equipo: EquiposFormData) => {
		try {
			setLoading(true);
			setError(null);

			return await updateEquipo(id, equipo);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Error al actualizar el equipo";
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

			await deleteEquipo(id);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Error al eliminar el equipo";
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

export async function getEquipoByIdService(id: string): Promise<Equipos> {
	return getEquipoById(id);
}

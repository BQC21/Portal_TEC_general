"use client";

import { createProveedor, deleteProveedor, getProveedor, getProveedorById, updateProveedor } from "@/features/controller/services/proveedoresQueries";
import { createClient } from "@/lib/supabase/client";
import { Supplier, SupplierFormData, UseSupplierMutationsResult, UseSupplierResult } from "@/lib/types/supabase/supplier-types";
import { useCallback, useEffect, useState } from "react";
import { getProveedorByIdService } from "./useRealtimeEquipos";

const supabase = createClient();

export function useProveedores(): UseSupplierResult {
	const [supplier, setSupplier] = useState<Supplier[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchProveedores = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);

			const data = await getProveedor();
			setSupplier(data);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Error al cargar los proveedores";
			setError(message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		void fetchProveedores();
	}, [fetchProveedores]);

	useEffect(() => {
		const channelName = `equipos-realtime-${Date.now()}-${Math.random().toString(36).slice(2)}`;
		const channel = supabase
			.channel(channelName)
			.on(
				"postgres_changes",
				{ event: "INSERT", schema: "public", table: "proveedores" },
				() => {
					void fetchProveedores();
				}
			)
			.on(
				"postgres_changes",
				{ event: "UPDATE", schema: "public", table: "proveedores" },
				() => {
					void fetchProveedores();
				}
			)
			.on(
				"postgres_changes",
				{ event: "DELETE", schema: "public", table: "proveedores" },
				() => {
					void fetchProveedores();
				}
			)
			.subscribe();

		return () => {
			void supabase.removeChannel(channel);
		};
	}, [fetchProveedores]);

	return {
        supplier,
		loading,
		error,
		refetch: fetchProveedores,
	};
}

export function useProveedoresMutations(): UseSupplierMutationsResult {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const create = useCallback(async (supplier: SupplierFormData) => {
		try {
			setLoading(true);
			setError(null);

			return await createProveedor(supplier);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Error al crear el proveedor";
			setError(message);
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const update = useCallback(async (id: string, supplier: SupplierFormData) => {
		try {
			setLoading(true);
			setError(null);

			return await updateProveedor(id, supplier);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Error al actualizar el proveedor";
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

			await deleteProveedor(id);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Error al eliminar el proveedor";
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

export async function getSupplierByIdService(id: string): Promise<Supplier> {
	return getProveedorById(id);
}

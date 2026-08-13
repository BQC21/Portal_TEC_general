"use client";

import { useMemo, useState } from "react";
import { FinantialFormState } from "@/lib/types/supabase/finantial-types";
import { Project_Equipos } from "@/lib/types/supabase/project_equipos_join";
import {
    computeFinantialAnalysis,
    getBatteryReplacementCost,
    getInverterReplacementCost,
} from "@/lib/utils/helpers/computes/finantial_computes";

// Rango de años para las gráficas
const DEFAULT_MAX_YEAR = 30;
const MIN_MAX_YEAR = 20;

export function useFinantialComputes(
    form: FinantialFormState,
    projectEquipos: Project_Equipos[]
) {
    // establecer año máximo
    const [maxYear, setMaxYear] = useState(DEFAULT_MAX_YEAR);

    // valor para inversor
    const inverterReplacementCost = useMemo(
        () => getInverterReplacementCost(projectEquipos),
        [projectEquipos]
    );
    // valor para batería
    const batteryReplacementCost = useMemo(
        () => getBatteryReplacementCost(projectEquipos),
        [projectEquipos]
    );

    // Almacenar valores relacionado al análisis financiero
    const analysis = useMemo(
        () =>
            computeFinantialAnalysis({
                precio_venta: Number(form.cotizacion_info?.precio_dolares) || 0,
                generacion: Number(form.generacion) || 0,
                tarifa_red: Number(form.tarifa_red) || 0,
                degra_1er: Number(form.degra_1er) || 0,
                degra_2do: Number(form.degra_2do) || 0,
                tarifa_crecimiento: Number(form.tarifa_crecimiento) || 0,
                tasa_descuento: Number(form.tasa_descuento) || 0,
                maxYear,
                inverterReplacementCost,
                batteryReplacementCost,
                inverterReplacementYears: (form.cambios_equipo ?? [])
                    .filter((cambio) => cambio.tipo === "INVERSOR")
                    .map((cambio) => Number(cambio.anio))
                    .filter((year) => year > 0),
                batteryReplacementYears: (form.cambios_equipo ?? [])
                    .filter((cambio) => cambio.tipo === "BATERÍA")
                    .map((cambio) => Number(cambio.anio))
                    .filter((year) => year > 0),
            }),
        [form, maxYear, inverterReplacementCost, batteryReplacementCost]
    );

    // añadir año
    function addYear() {
        setMaxYear((current) => current + 1);
    }

    // remover año
    function removeYear() {
        setMaxYear((current) => Math.max(MIN_MAX_YEAR, current - 1));
    }

    return {
        analysis,
        maxYear,
        addYear,
        removeYear,
        inverterReplacementCost,
    };
}

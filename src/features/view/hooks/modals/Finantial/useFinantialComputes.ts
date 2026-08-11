"use client";

import { useMemo, useState } from "react";
import { FinantialFormState } from "@/lib/types/supabase/finantial-types";
import { Project_Equipos } from "@/lib/types/supabase/project_equipos_join";
import {
    computeFinantialAnalysis,
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

    // Almacenar valores relacionado al análisis financiero
    const analysis = useMemo(
        () =>
            computeFinantialAnalysis({
                precio_venta: Number(form.cotizacion_info?.precio_dolares) || 0,
                generacion: Number(form.generacion) || 0,
                tarifa_red: Number(form.tarifa_red) || 0,
                degra_1er: Number(form.degra_1er) || 0,
                degra_2do: Number(form.degra_2do) || 0,
                tasa_crecimiento: Number(form.tasa_crecimiento) || 0,
                tasa_descuento: Number(form.tasa_descuento) || 0,
                maxYear,
                inverterReplacementCost,
            }),
        [form, maxYear, inverterReplacementCost]
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

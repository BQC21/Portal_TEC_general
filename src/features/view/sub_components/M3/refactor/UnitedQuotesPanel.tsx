"use client";

import { AddProductTextField } from "@/features/view/components/Form_fields/AddTextField";
import { AddProductNumberField } from "@/features/view/components/Form_fields/AddNumberField";
import { AddProductSearchableSelectField } from "@/features/view/components/Form_fields/AddSearchableSelectField";
import { SummaryCostTable } from "@/features/view/sub_components/M3/Tables/quotes/tables/SummaryCostTable";
import { SummaryCostTable1 } from "@/features/view/sub_components/M3/Tables/quotes/tables/SummaryCostTable1";
import { SummaryCostTable2 } from "@/features/view/sub_components/M3/Tables/quotes/tables/SummaryCostTable2";
import { quoteOptionLabel } from "@/lib/utils/helpers/quotes/linkQuote2Project";
import {
    MAX_UNITED_QUOTES,
    MIN_UNITED_QUOTES,
    SELECT_QUOTE_PLACEHOLDER,
} from "@/lib/utils/consts/unitedQuotes";
import { UnitedQuotesPanelProps } from "@/lib/types/components/sub_components/module_render";

export function UnitedQuotesPanel({
    nombre,
    onNombreChange,
    cantidad,
    onCantidadChange,
    selectedIds,
    onSelectQuote,
    availableQuotes,
    allQuotes,
    equiposDescriptions,
    materialesDescriptions,
    recursosCosts,
    viaticosCosts,
    precioFinalCosts,
    nameOnlyEditable = false,
}: UnitedQuotesPanelProps) {
    function optionsForSlot(index: number) {
        const currentId = selectedIds[index];
        const taken = new Set(
            selectedIds.filter((id, slot) => id && slot !== index),
        );
        const options = availableQuotes.filter((quote) => {
            if (currentId && String(quote.id) === String(currentId)) return true;
            return !taken.has(String(quote.id));
        });
        const labels = [SELECT_QUOTE_PLACEHOLDER, ...options.map((quote) => quoteOptionLabel(quote))];
        const currentValue = valueForSlot(index);
        if (currentValue !== SELECT_QUOTE_PLACEHOLDER && !labels.includes(currentValue)) {
            labels.splice(1, 0, currentValue);
        }
        return labels;
    }

    function valueForSlot(index: number) {
        const currentId = selectedIds[index];
        if (!currentId) return SELECT_QUOTE_PLACEHOLDER;
        const quote = allQuotes.find((item) => String(item.id) === String(currentId));
        return quote ? quoteOptionLabel(quote) : "Cotización no disponible";
    }

    function handleSelect(index: number, value: string) {
        if (value === SELECT_QUOTE_PLACEHOLDER) {
            onSelectQuote(index, "");
            return;
        }
        const selected = availableQuotes.find((quote) => quoteOptionLabel(quote) === value)
            ?? allQuotes.find((quote) => quoteOptionLabel(quote) === value);
        onSelectQuote(index, selected?.id ?? "");
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-end justify-center gap-8">
                <div className="min-w-[280px] max-w-xl flex-1">
                    <AddProductTextField
                        label="Nombre de la cotización"
                        required
                        value={nombre}
                        onChange={onNombreChange}
                        placeholder="Ej. Prodac - 5 proyectos"
                    />
                </div>
                <div className="w-40">
                    <AddProductNumberField
                        label="Cantidad de cotizaciones"
                        required
                        centered
                        disabled={nameOnlyEditable}
                        value={Number.isFinite(cantidad) ? cantidad : ""}
                        onChange={(value) => onCantidadChange(value)}
                        step={1}
                        min={MIN_UNITED_QUOTES}
                        max={MAX_UNITED_QUOTES}
                    />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: cantidad }, (_, index) => (
                    <AddProductSearchableSelectField
                        key={`united-quote-${index}`}
                        label={`Cotización ${index + 1}`}
                        required
                        disabled={nameOnlyEditable}
                        value={valueForSlot(index)}
                        options={optionsForSlot(index)}
                        searchPlaceholder="Buscar cotización..."
                        emptyMessage="No hay cotizaciones disponibles con ese nombre"
                        onChange={(value) => handleSelect(index, value)}
                    />
                ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.1fr_1.1fr_1.4fr]">
                <div className="rounded-2xl border border-slate-200 p-4">
                    <h3 className="mb-3 text-lg font-semibold text-slate-900">
                        Equipos seleccionados
                    </h3>
                    <p className="max-h-64 overflow-y-auto whitespace-pre-line text-slate-700">
                        {equiposDescriptions.length > 0
                            ? equiposDescriptions.join("\n")
                            : "No hay equipos registrados para este proyecto."}
                    </p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-4">
                    <h3 className="mb-3 text-lg font-semibold text-slate-900">
                        Materiales seleccionados
                    </h3>
                    <p className="max-h-64 overflow-y-auto whitespace-pre-line text-slate-700">
                        {materialesDescriptions.length > 0
                            ? materialesDescriptions.join("\n")
                            : "No hay materiales registrados para este proyecto."}
                    </p>
                </div>
                <div className="grid gap-4 content-start">
                    <SummaryCostTable1 recursosCosts={recursosCosts} />
                    <SummaryCostTable2 viaticosCosts={viaticosCosts} />
                    <SummaryCostTable precioFinal={precioFinalCosts} />
                </div>
            </div>
        </div>
    );
}

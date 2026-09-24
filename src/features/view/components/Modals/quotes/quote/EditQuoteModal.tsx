"use client"

import { EditQuoteModalProps } from "@/lib/types/components/General/modals";
import { AddProductCloseIcon } from "../../../Icons/AddCloseIcon";
import { useEffect, useMemo, useState } from "react";
import { QuoteFormState } from "@/lib/types/supabase/quote-types";
import { createManualCostsFromQuote, createQuoteFormStateFromQuote } from "@/features/model/mapping/mapping_quotes";
import { SummaryCostTable } from "@/features/view/refactor/M3/Tables/quotes/tables/SummaryCostTable";
import { useCostComputes } from "@/features/ViewModel/hooks/modals/Quotes/useCostComputes";
import { ManualCosts } from "@/lib/types/components/Quotes/manual_resources";
import { ManageLocalCosts } from "@/features/ViewModel/hooks/modals/Quotes/useManageLocalCosts";
import { Product_selected } from "@/features/view/refactor/M3/refactor/quotes/Product_selected";
import { ResourcesTables } from "@/features/view/refactor/M3/refactor/quotes/ResourcesTables";
import { ViaticosTables } from "@/features/view/refactor/M3/refactor/quotes/ViaticosTables";
import { useQuoteSelectedProducts } from "@/features/ViewModel/hooks/modals/Quotes/useQuoteSelectedProducts";
import { ExcelResizableTables } from "@/features/view/components/Shells/ExcelResizableTables";
import {
    syncQuoteEquiposToProject,
    syncQuoteMaterialesToProject,
    withQuoteResourceSnapshot,
} from "@/lib/utils/helpers/project_modals/quoteResourceSnapshot";
import { AddProductTextField } from "../../../Form_fields/AddTextField";
import { isQuoteLinkedToProject, quoteHeadingLabel } from "@/lib/utils/helpers/quotes/linkQuote2Project";
import { UnitedQuotesPanel } from "@/features/view/refactor/M3/refactor/quotes/UnitedQuotesPanel";
import { useUnitedQuoteAggregation } from "@/features/ViewModel/hooks/modals/Quotes/useUnitedQuoteAggregation";
import { useQuotes } from "@/features/ViewModel/hooks/services/useRealtimeQuotes";
import {
    eligibleQuotesForUnion,
    getUnitedQuoteInfo,
    isUnitedQuote,
    productDescriptions,
} from "@/lib/utils/helpers/quotes/unitedQuotes";
import { MIN_UNITED_QUOTES } from "@/lib/utils/consts/unitedQuotes";

export default function EditQuoteModal({
    existingQuote, onUpdateQuote, onClose, 
    existing_project_equipos, existing_project_materiales,
}: EditQuoteModalProps){
    // ----------
    // ESTADOS
    // ----------

    const [form, setForm] = useState<QuoteFormState>(() => createQuoteFormStateFromQuote(existingQuote))
    const { quotes } = useQuotes();

    const unitedInfo = getUnitedQuoteInfo(existingQuote);
    const isUnited = isUnitedQuote(existingQuote);
    const unitedIds = unitedInfo?.quote_ids ?? [];
    const unitedCount = unitedInfo?.cantidad || unitedIds.length || MIN_UNITED_QUOTES;

    const unionEligibleQuotes = useMemo(
        () => eligibleQuotesForUnion(quotes, existingQuote.id),
        [quotes, existingQuote.id],
    );

    const unitedAggregation = useUnitedQuoteAggregation({
        quotes,
        selectedIds: unitedIds,
        existingProjectEquipos: existing_project_equipos,
        existingProjectMateriales: existing_project_materiales,
    });

    const unitedFallbackDescriptions = productDescriptions(
        form.costos_manuales?.Recursos?.equipos_seleccionados ?? [],
        form.costos_manuales?.Recursos?.materiales_seleccionados ?? [],
    );

    // ----------
    // TECNOLOGÍA SELECCIONADA
    // ----------    
    
    const hasSelectedProject = Boolean(form.proyecto_id);
    const isIndependent = !isQuoteLinkedToProject(form) && !isUnited;
    const showQuoteBody = (hasSelectedProject || isIndependent) && !isUnited;

    const {
        projectEquipos,
        projectMateriales,
        equiposDescriptions,
        materialesDescriptions,
        onUpdateEquipoCantidad,
        onAddEquipo,
        onRemoveEquipo,
        onUpdateMaterialCantidad,
        onAddMaterial,
        onReplaceMaterial,
        onRemoveMaterial,
    } = useQuoteSelectedProducts({
        proyectoId: form.proyecto_id,
        existingProjectEquipos: existing_project_equipos,
        existingProjectMateriales: existing_project_materiales,
        savedEquipos: form.costos_manuales?.Recursos?.equipos_seleccionados,
        savedMateriales: form.costos_manuales?.Recursos?.materiales_seleccionados,
    });

    // ----------
    // EVENTOS
    // ----------

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isUnited) {
            await onUpdateQuote({
                ...form,
                nombre_cotizacion: form.nombre_cotizacion?.trim() ?? "",
                updated_at: new Date(),
            });
            return;
        }

        const costos_manuales = withQuoteResourceSnapshot(
            manualResourceCosts,
            projectEquipos,
            projectMateriales,
        );
        if (!isIndependent && form.proyecto_id) {
            await syncQuoteEquiposToProject(
                form.proyecto_id,
                projectEquipos,
                existing_project_equipos,
            );
            await syncQuoteMaterialesToProject(
                form.proyecto_id,
                projectMateriales,
                existing_project_materiales,
            );
        }
        await onUpdateQuote({
            ...form,
            costos_manuales,
            precio_dolares: String(precioFinal.dolares.toFixed(2)),
            updated_at: new Date(),
        });
    }

    function updateField<K extends keyof QuoteFormState>(field: K, value: QuoteFormState[K]) {
        setForm((current) => ({ ...current, [field]: value }));
    }

    // ----------
    // CÁLCULOS MANUALES
    // ----------

    const [manualResourceCosts, setManualResourceCosts] = 
        useState<ManualCosts>(() => createManualCostsFromQuote(existingQuote)); // valores iniciales

    const { updateManualCostItem, 
        updateManualCostMonto,
        addManualCostItem, 
        removeManualCostItem,
        updateConsiderarEppReutilizable,
        updateEstructurasCantidadManual,
        addConsumeItem,
        updateRecursosConsiderFlag,
        toggleConsumibleOculto,
        setConsumiblesHidden,
    } = ManageLocalCosts(setManualResourceCosts);

    // ----------
    // CÁLCULOS TOTALES
    // ----------

    const { recursos, viaticos, precioFinal, grossMargin } = useCostComputes(
        projectEquipos, projectMateriales, manualResourceCosts,
        Number(form.gm_general), Number(form.markup), Number(form.gm_viaticos), Number(form.tasa_cambio),
        Number(form.depre_tool),
        isIndependent,
    );

    // ----------
    // SINCRONIZAR GROSS MARGIN
    // ----------

    useEffect(() => {
        if (isUnited) return;
        const nextGm = String(grossMargin.gm.gm);
        if (Number(grossMargin.gm.gm) > 0 && form.gm !== nextGm) {
            updateField("gm", String(grossMargin.gm.gm));
        }
    }, [grossMargin.gm.gm, isUnited]);

    // ----------
    // SINCRONIZAR PRECIO DÓLARES
    // ----------

    useEffect(() => {
        if (isUnited) return;
        const next = String(precioFinal.dolares.toFixed(2));
        if (form.precio_dolares !== next) {
            setForm((current) => ({ ...current, precio_dolares: next }));
        }
    }, [precioFinal.dolares, isUnited]);

    const unitedHasLiveChildren = unitedAggregation.selectedQuotes.length > 0;

    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-2">
            <div className="flex h-[96vh] max-h-[96vh] w-[96vw] max-w-[1800px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-5">
                    <h2 className="text-2xl font-bold text-slate-900">Actualizar Cotización</h2>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                            aria-label="Cerrar modal"
                        >
                            <AddProductCloseIcon />
                        </button>
                </div>

                <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
                    <div className="modal-scroll min-h-0 flex-1 px-6 py-6">

                    {isUnited && (
                        <div className="mb-6 space-y-6">
                            <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-slate-700">
                                <p className="text-lg font-medium">
                                    Esta cotización es la unión de otras cotizaciones
                                </p>
                                <p className="mt-1 text-base">
                                    Solo puede actualizar el nombre. La cantidad y las cotizaciones seleccionadas quedan fijas.
                                </p>
                            </div>
                            <UnitedQuotesPanel
                                nombre={form.nombre_cotizacion ?? ""}
                                onNombreChange={(value) => updateField("nombre_cotizacion", value)}
                                cantidad={unitedCount}
                                onCantidadChange={() => undefined}
                                selectedIds={unitedIds}
                                onSelectQuote={() => undefined}
                                availableQuotes={unionEligibleQuotes}
                                allQuotes={quotes}
                                equiposDescriptions={
                                    unitedHasLiveChildren
                                        ? unitedAggregation.equiposDescriptions
                                        : unitedFallbackDescriptions.equiposDescriptions
                                }
                                materialesDescriptions={
                                    unitedHasLiveChildren
                                        ? unitedAggregation.materialesDescriptions
                                        : unitedFallbackDescriptions.materialesDescriptions
                                }
                                recursosCosts={unitedHasLiveChildren ? unitedAggregation.recursos : recursos}
                                viaticosCosts={unitedHasLiveChildren ? unitedAggregation.viaticos : viaticos}
                                precioFinalCosts={unitedHasLiveChildren ? unitedAggregation.precioFinal : precioFinal}
                                nameOnlyEditable
                            />
                        </div>
                    )}

                    {isIndependent && (
                        <div className="mb-6 space-y-4">
                            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-slate-700">
                                <p className="text-lg font-medium">
                                    Esta cotización no está asociada a un proyecto de dimensionamiento.
                                </p>
                                <p className="mt-1 text-base">
                                    Se sugiere asignarle un nombre para identificarla en el listado.
                                </p>
                            </div>
                            <AddProductTextField
                                label="Nombre de la cotización independiente"
                                value={form.nombre_cotizacion ?? ""}
                                onChange={(value) => updateField("nombre_cotizacion", value)}
                                placeholder="Ej. Consulta libre"
                            />
                        </div>
                    )}

                    {showQuoteBody && (
                        <ExcelResizableTables>

                        <h1 className="text-2xl font-bold text-slate-500">
                            {quoteHeadingLabel(form)}
                        </h1>

                        <Product_selected
                            equiposDescriptions={equiposDescriptions}
                            materialesDescriptions={materialesDescriptions}
                            form={form}
                            updateField={updateField}
                            grossMargin={grossMargin}
                        />

                        <ResourcesTables
                            recursos={recursos}
                            projectEquipos={projectEquipos}
                            projectMateriales={projectMateriales}
                            form={form}
                            manualResourceCosts={manualResourceCosts}
                            updateManualCostMonto={updateManualCostMonto}
                            updateManualCostItem={updateManualCostItem}
                            addManualCostItem={addManualCostItem}
                            removeManualCostItem={removeManualCostItem}
                            updateConsiderarEppReutilizable={updateConsiderarEppReutilizable}
                            updateEstructurasCantidadManual={updateEstructurasCantidadManual}
                            onUpdateEquipoCantidad={onUpdateEquipoCantidad}
                            onUpdateMaterialCantidad={onUpdateMaterialCantidad}
                            onAddEquipo={onAddEquipo}
                            onRemoveEquipo={onRemoveEquipo}
                            onAddMaterial={onAddMaterial}
                            onReplaceMaterial={onReplaceMaterial}
                            onRemoveMaterial={onRemoveMaterial}
                            onAddConsumeItem={addConsumeItem}
                            showResourceChecklists={isIndependent}
                            updateRecursosConsiderFlag={updateRecursosConsiderFlag}
                            toggleConsumibleOculto={toggleConsumibleOculto}
                            setConsumiblesHidden={setConsumiblesHidden}
                        />

                        <ViaticosTables
                            viaticos={viaticos}
                            manualResourceCosts={manualResourceCosts}
                            updateManualCostMonto={updateManualCostMonto}
                            updateManualCostItem={updateManualCostItem}
                            addManualCostItem={addManualCostItem}
                            removeManualCostItem={removeManualCostItem}
                        />
                        
                        {/* TABLA FINAL */}
                        <div className="mt-6 grid gap-6 grid-cols">
                            <SummaryCostTable
                                precioFinal={precioFinal}
                            />
                        </div>
                        </ExcelResizableTables>
                    )}

                    </div>
                    <div className="flex shrink-0 items-center justify-between border-t border-slate-200 px-6 py-5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-slate-300 px-6 py-3 text-lg font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="rounded-xl bg-brand-500 px-6 py-3 text-lg font-semibold text-white transition hover:bg-brand-600"
                        >
                            Actualizar Cotización
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

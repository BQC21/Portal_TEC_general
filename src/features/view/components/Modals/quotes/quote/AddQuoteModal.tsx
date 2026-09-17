"use client"

import { AddQuoteModalProps } from "@/lib/types/components/General/modals";
import { AddProductCloseIcon } from "../../../Icons/AddCloseIcon";
import { useProjects } from "@/features/view/hooks/services/useRealtimeProjects";
import { useEffect, useMemo, useState } from "react";
import { QuoteFormState } from "@/lib/types/supabase/quote-types";
import { INITIAL_MANUAL_RESOURCE_COSTS, INITIAL_PROJECT_FORM, INITIAL_QUOTE_FORM } from "@/lib/utils/initialValues";
import { ProjectFormState } from "@/lib/types/supabase/project-types";
import { ProjectSelection } from "@/features/view/hooks/modals/Quotes/useProjectSelection";
import { SummaryCostTable } from "@/features/view/sub_components/M3/Tables/quotes/tables/SummaryCostTable";
import { useCostComputes } from "@/features/view/hooks/modals/Quotes/useCostComputes";
import { getQuoteCode } from "@/lib/utils/helpers/manage_info/getQuoteCode";
import { ManualCosts } from "@/lib/types/components/Quotes/manual_resources";
import { ManageLocalCosts } from "@/features/view/hooks/modals/Quotes/useManageLocalCosts";
import { Product_selected } from "@/features/view/sub_components/M3/refactor/Product_selected";
import { ResourcesTables } from "@/features/view/sub_components/M3/refactor/ResourcesTables";
import { ViaticosTables } from "@/features/view/sub_components/M3/refactor/ViaticosTables";
import { useQuoteSelectedProducts } from "@/features/view/hooks/modals/Quotes/useQuoteSelectedProducts";
import { ExcelResizableTables } from "@/features/view/components/Shells/ExcelResizableTables";
import {
    syncQuoteEquiposToProject,
    syncQuoteMaterialesToProject,
    withQuoteResourceSnapshot,
} from "@/lib/utils/helpers/project_modals/quoteResourceSnapshot";
import { AddProductSearchableSelectField } from "../../../Form_fields/AddSearchableSelectField";
import { UnitedQuotesPanel } from "@/features/view/sub_components/M3/refactor/UnitedQuotesPanel";
import { useUnitedQuoteAggregation } from "@/features/view/hooks/modals/Quotes/useUnitedQuoteAggregation";
import {
    eligibleQuotesForUnion,
    emptySelectedIds,
    MAX_UNITED_QUOTES,
    MIN_UNITED_QUOTES,
    withUnionInfo,
} from "@/lib/utils/helpers/quotes/unitedQuotes";
import { quoteHeadingLabel } from "@/lib/utils/helpers/quotes/linkQuote2Project";
import { QuoteMode } from "@/lib/types/components/General/options";

export default function AddQuoteModal({
    onAddQuote,
    onClose,
    existingQuotes = [],
    existing_project_equipos,
    existing_project_materiales,
}: AddQuoteModalProps) {

    // ----------
    // ESTADOS
    // ----------

    const [form, setForm] = useState<QuoteFormState>(INITIAL_QUOTE_FORM);
    
    const { projects } = useProjects();
    const [form_project, setForm_project] = useState<ProjectFormState>(INITIAL_PROJECT_FORM);
    const quotedProjectIds = useMemo(
        () => new Set(existingQuotes.map((quote) => String(quote.proyecto_id))),
        [existingQuotes],
    );
    const availableProjects = useMemo(
        () => projects.filter((project) => !quotedProjectIds.has(String(project.id))),
        [projects, quotedProjectIds],
    );

    const [quoteMode, setQuoteMode] = useState<QuoteMode>("project"); // modo de cotizacion
    const isIndependent = quoteMode === "independent"; // es independiente (flag)
    const isUnited = quoteMode === "united"; // esta unido (flag)
    const hasSelectedProject = Boolean(form.proyecto_id); // flag determinante de la existencia de proyectos
    const showQuoteBody = hasSelectedProject || isIndependent; 

    // cotizaciones unidas
    const [unitedName, setUnitedName] = useState("");
    const [unitedCount, setUnitedCount] = useState(MIN_UNITED_QUOTES);
    const [unitedIds, setUnitedIds] = useState<string[]>(() => emptySelectedIds(MIN_UNITED_QUOTES));
    const [submitError, setSubmitError] = useState("");

    const unionEligibleQuotes = useMemo(
        () => eligibleQuotesForUnion(existingQuotes),
        [existingQuotes],
    );

    const unitedAggregation = useUnitedQuoteAggregation({
        quotes: existingQuotes,
        selectedIds: unitedIds,
        existingProjectEquipos: existing_project_equipos,
        existingProjectMateriales: existing_project_materiales,
    });

    // ----------
    // TECNOLOGÍA SELECCIONADA
    // ----------

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

    // actualizar campos
    function updateField<K extends keyof QuoteFormState>(field: K, value: QuoteFormState[K]) {
        setForm((current) => ({ ...current, [field]: value }));
    }

    // ingresar cotización independiente
    function enterIndependent() {
        setQuoteMode("independent");
        setSubmitError("");
        ProjectSelection("Seleccione proyecto", availableProjects, setForm_project, setForm);
    }

    // ingresar unión de cotizaciones
    function enterUnited() {
        setQuoteMode("united");
        setSubmitError("");
        ProjectSelection("Seleccione proyecto", availableProjects, setForm_project, setForm);
    }

    // Contar la cantidad de cotizaciones unidas
    function handleUnitedCountChange(value: number) {
        const next = Math.min(
            MAX_UNITED_QUOTES,
            Math.max(MIN_UNITED_QUOTES, Number.isFinite(value) ? Math.trunc(value) : MIN_UNITED_QUOTES),
        );
        setUnitedCount(next);
        setUnitedIds((current) => {
            const nextIds = current.slice(0, next);
            while (nextIds.length < next) nextIds.push("");
            return nextIds;
        });
    }

    // seleccionar las cotizaciones a unirse
    function handleUnitedSelect(index: number, quoteId: string) {
        setUnitedIds((current) => current.map((id, slot) => slot === index ? quoteId : id));
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (isUnited) {

            // ------------- Cotizaciones unidas --------
            
            const selectedIds = unitedIds.filter(Boolean);
            if (!unitedName.trim()) {
                setSubmitError("Ingrese el nombre de la cotización unida.");
                return;
            }
            if (selectedIds.length !== unitedCount || new Set(selectedIds).size !== selectedIds.length) {
                setSubmitError("Seleccione todas las cotizaciones a reunir, sin repetirlas.");
                return;
            }
            setSubmitError("");

            const costos_manuales = withUnionInfo(
                withQuoteResourceSnapshot(
                    unitedAggregation.mergedManualCosts ?? INITIAL_MANUAL_RESOURCE_COSTS,
                    unitedAggregation.mergedEquipos,
                    unitedAggregation.mergedMateriales,
                ),
                {
                    quote_ids: selectedIds,
                    cantidad: unitedCount,
                },
            );
            const seed = unitedAggregation.seedQuote;

            await onAddQuote({
                ...form,
                proyecto_id: "",
                proyecto_info: undefined,
                nombre_cotizacion: unitedName.trim(),
                igv: seed?.igv ?? form.igv,
                tasa_cambio: seed?.tasa_cambio ?? form.tasa_cambio,
                markup: seed?.markup ?? form.markup,
                gm_general: seed?.gm_general ?? form.gm_general,
                gm_viaticos: seed?.gm_viaticos ?? form.gm_viaticos,
                gm: String(unitedAggregation.grossMargin.gm.gm || 0),
                depre_tool: seed?.depre_tool ?? form.depre_tool,
                costos_manuales,
                precio_dolares: String(unitedAggregation.precioFinal.dolares.toFixed(2)),
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
        await onAddQuote({
            ...form,
            costos_manuales,
            precio_dolares: String(precioFinal.dolares.toFixed(2)),
        });
    }

    // ----------
    // CÁLCULOS MANUALES
    // ----------

    const [manualResourceCosts, setManualResourceCosts] = 
    useState<ManualCosts>(INITIAL_MANUAL_RESOURCE_COSTS); // valores iniciales

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

    // ----------
    // SINCRONIZAR CODIFICACIÓN AUTOMÁTICA 
    // ----------
    const existingQuoteCodesKey = existingQuotes
        .map((quote) => quote.cod_cotizacion)
        .join("|");

    useEffect(() => {
        const nextCode = getQuoteCode(existingQuotes.map((quote) => quote.cod_cotizacion));
        updateField("cod_cotizacion", nextCode);
        // Solo al abrir el modal / cuando cambia el listado de códigos.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [existingQuoteCodesKey]);

    // ----------
    // Estilizaciones preliminares
    // ----------
    const modeButtonClass = (active: boolean) =>
        `shrink-0 rounded-xl px-6 py-3 text-lg font-semibold transition ${
            active
                ? "bg-brand-500 text-white hover:bg-brand-600"
                : "border border-slate-300 text-slate-700 hover:bg-slate-50"
        }`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-2">
            <div className="flex h-[96vh] max-h-[96vh] w-[96vw] max-w-[1800px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-6 py-5">
                    <h2 className="text-2xl font-bold text-slate-900">Añadir Nueva Cotización</h2>
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
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                        <div className="min-w-0 flex-1">
                            <AddProductSearchableSelectField
                                label="Seleccionar Proyecto"
                                required={!isIndependent && !isUnited}
                                disabled={isIndependent || isUnited}
                                value={form_project.nombre ?? ""}
                                options={["Seleccione proyecto", ...availableProjects.map((project) => project.nombre)]}
                                searchPlaceholder="Buscar proyecto..."
                                emptyMessage="No hay proyectos sin cotizar con ese nombre"
                                onChange={(value) => {
                                    setQuoteMode("project");
                                    ProjectSelection(value, availableProjects, setForm_project, setForm);
                                }}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={enterIndependent}
                            className={modeButtonClass(isIndependent)}
                        >
                            Cotización independiente
                        </button>
                        <button
                            type="button"
                            onClick={enterUnited}
                            className={modeButtonClass(isUnited)}
                        >
                            Cotizaciones unidas
                        </button>
                    </div>

                    {isUnited && (
                        <div className="mt-8">
                            <UnitedQuotesPanel
                                nombre={unitedName}
                                onNombreChange={setUnitedName}
                                cantidad={unitedCount}
                                onCantidadChange={handleUnitedCountChange}
                                selectedIds={unitedIds}
                                onSelectQuote={handleUnitedSelect}
                                availableQuotes={unionEligibleQuotes}
                                allQuotes={existingQuotes}
                                equiposDescriptions={unitedAggregation.equiposDescriptions}
                                materialesDescriptions={unitedAggregation.materialesDescriptions}
                                recursosCosts={unitedAggregation.recursos}
                                viaticosCosts={unitedAggregation.viaticos}
                                precioFinalCosts={unitedAggregation.precioFinal}
                            />
                        </div>
                    )}

                    {showQuoteBody && !isUnited && (
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
                        <div className="flex items-center gap-4">
                            {submitError ? (
                                <p className="text-base font-medium text-red-600">{submitError}</p>
                            ) : null}
                            <button
                                type="submit"
                                className="rounded-xl bg-brand-500 px-6 py-3 text-lg font-semibold text-white transition hover:bg-brand-600"
                            >
                                Añadir Cotización
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

"use client"

import { AddQuoteModalProps } from "@/lib/types/components/General/modals";
import { AddProductCloseIcon } from "../../../Icons/AddCloseIcon";
import { useProjects } from "@/features/view/hooks/services/useRealtimeProjects";
import { useCallback, useEffect, useState } from "react";
import { QuoteFormState } from "@/lib/types/supabase/quote-types";
import { INITIAL_MANUAL_RESOURCE_COSTS, INITIAL_PROJECT_FORM, INITIAL_QUOTE_FORM } from "@/lib/utils/initialValues";
import { ProjectFormState } from "@/lib/types/supabase/project-types";
import { AddProductSelectField } from "../../../Form_fields/AddSelectField";
import { ProjectSelection } from "@/features/view/hooks/modals/Quotes/useProjectSelection";
import { SummaryCostTable } from "@/features/view/sub_components/M3/Tables/quotes/tables/SummaryCostTable";
import { useCostComputes } from "@/features/view/hooks/modals/Quotes/useCostComputes";
import { getQuoteCode } from "@/lib/utils/helpers/manage_info/getQuoteCode";
import { ManualCosts } from "@/lib/types/components/Quotes/manual_resources";
import { ManageLocalCosts } from "@/features/view/hooks/modals/Quotes/useManageLocalCosts";
import { Product_selected } from "@/features/view/sub_components/M3/refactor/Product_selected";
import { ResourcesTables } from "@/features/view/sub_components/M3/refactor/ResourcesTables";
import { ViaticosTables } from "@/features/view/sub_components/M3/refactor/ViaticosTables";
import { Project_Equipos } from "@/lib/types/supabase/project_equipos_join";
import { Project_Materiales } from "@/lib/types/supabase/project_materiales_join";
import { Materiales } from "@/lib/types/supabase/materiales-types";
import { Equipos } from "@/lib/types/supabase/equipos-types";

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

    // ----------
    // TECNOLOGÍA SELECCIONADA
    // ----------

    const hasSelectedProject = Boolean(form.proyecto_id);

    const [projectEquipos, setProjectEquipos] = useState<Project_Equipos[]>([]);
    const [projectMateriales, setProjectMateriales] = useState<Project_Materiales[]>([]);

    useEffect(() => {
        if (!form.proyecto_id) {
            setProjectEquipos([]);
            setProjectMateriales([]);
            return;
        }

        setProjectEquipos(
            existing_project_equipos.filter((item) => item.proyecto_id === form.proyecto_id),
        );
        setProjectMateriales(
            existing_project_materiales.filter((item) => item.proyecto_id === form.proyecto_id),
        );
        // Solo al elegir/cambiar proyecto: no sobrescribir ediciones locales de cantidad.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.proyecto_id]);

    const onUpdateEquipoCantidad = useCallback((id: string | number, cantidad: number) => {
        setProjectEquipos((current) =>
            current.map((item) =>
                item.id === id ? { ...item, cantidad: String(cantidad) } : item,
            ),
        );
    }, []);

    const onAddEquipo = useCallback((equipo: Equipos) => {
        setProjectEquipos((current) => {
            if (current.some((item) => String(item.equipo_id) === String(equipo.id))) {
                return current;
            }

            const nextItem: Project_Equipos = {
                id: `local-equipo-${equipo.id}-${Date.now()}`,
                equipo_id: String(equipo.id),
                equipo_info: equipo,
                proyecto_id: form.proyecto_id,
                fecha_agregado: new Date(),
                cantidad: "1",
            };

            return [...current, nextItem];
        });
    }, [form.proyecto_id]);

    const onRemoveEquipo = useCallback((id: string | number) => {
        setProjectEquipos((current) => current.filter((item) => item.id !== id));
    }, []);

    const onUpdateMaterialCantidad = useCallback((id: string | number, cantidad: number) => {
        setProjectMateriales((current) =>
            current.map((item) =>
                item.id === id ? { ...item, cantidad: String(cantidad) } : item,
            ),
        );
    }, []);

    const onAddMaterial = useCallback((material: Materiales) => {
        setProjectMateriales((current) => {
            if (current.some((item) => String(item.material_id) === String(material.id))) {
                return current;
            }

            const nextItem: Project_Materiales = {
                id: `local-material-${material.id}-${Date.now()}`,
                material_id: String(material.id),
                material_info: material,
                proyecto_id: form.proyecto_id,
                fecha_agregado: new Date(),
                cantidad: "1",
            };

            return [...current, nextItem];
        });
    }, [form.proyecto_id]);

    const onRemoveMaterial = useCallback((id: string | number) => {
        setProjectMateriales((current) => current.filter((item) => item.id !== id));
    }, []);

    // --- rescatamos su descripción
    const equiposDescriptions = projectEquipos
        .map((item) => item.equipo_info?.descripcion)
        .filter((description): description is string => Boolean(description));

    const materialesDescriptions = projectMateriales
        .map((item) => item.material_info?.descripcion)
        .filter((description): description is string => Boolean(description));

    // ----------
    // EVENTOS
    // ----------

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        await onAddQuote({ 
            ...form, 
            costos_manuales: manualResourceCosts,
        });
    }

    function updateField<K extends keyof QuoteFormState>(field: K, value: QuoteFormState[K]) {
        setForm((current) => {
            const updated = { ...current, [field]: value, 
                precio_dolares: String(precioFinal.dolares.toFixed(2)) };
            return updated;
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
    } = ManageLocalCosts(setManualResourceCosts);

    // ----------
    // CÁLCULOS TOTALES
    // ----------

    const { recursos, viaticos, precioFinal, grossMargin } = useCostComputes(
        projectEquipos, projectMateriales, manualResourceCosts,
        Number(form.gm_general), Number(form.markup), Number(form.gm_viaticos), Number(form.tasa_cambio),
    );

    // ----------
    // SINCRONIZAR GROSS MARGIN
    // ----------

    useEffect(() => {
        const nextGm = String(grossMargin.gm.gm);
        if (Number(grossMargin.gm.gm) > 0 && form.gm !== nextGm) {
            updateField("gm", String(grossMargin.gm.gm));
        }
    }, [grossMargin.gm.gm]);

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
    // LOGS
    // ----------

    console.log("valor del grossMargin", (grossMargin.gm.gm * 100).toFixed(2));
    // RECURSOS
    console.log("valor del precio de venta soles", recursos.resumen.ventaSoles);
    // VIÁTICOS
    console.log("valor del precio de venta soles", viaticos.resumen.ventaSoles);
    // DEFINITIVO
    console.log("valor del precio final", precioFinal.soles);
    console.log("valor del precio final IGV", precioFinal.solesIgv);
    console.log("valor del precio final dolares", precioFinal.dolares);
    console.log("valor del precio final dolares IGV", precioFinal.dolaresIgv);


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-2">
            <div className="max-h-[96vh] w-[96vw] max-w-[1800px] overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
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

                <form onSubmit={handleSubmit} className="max-h-[calc(96vh-88px)] overflow-y-auto px-6 py-6">
                    <AddProductSelectField
                        label="Seleccionar Proyecto"
                        required
                        value={form_project.nombre}
                        options={["Seleccione proyecto", ...projects.map((project) => project.nombre)]}
                        onChange={(value) => ProjectSelection(value, projects, setForm_project, setForm)}
                    />

                    {hasSelectedProject && (
                        <>
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
                            onUpdateEquipoCantidad={onUpdateEquipoCantidad}
                            onUpdateMaterialCantidad={onUpdateMaterialCantidad}
                            onAddEquipo={onAddEquipo}
                            onRemoveEquipo={onRemoveEquipo}
                            onAddMaterial={onAddMaterial}
                            onRemoveMaterial={onRemoveMaterial}
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
                        </>
                    )}

                    <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-5">
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
                            Añadir Cotización
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

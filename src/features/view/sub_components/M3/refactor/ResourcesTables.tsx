import { ResourcesTablesProps } from "@/lib/types/components/sub_components/module_render";
import { SummaryCostTable1 } from "../Tables/quotes/tables/SummaryCostTable1";
import { CollapsibleTableSection } from "@/features/view/components/Shells/CollapsibleTableSection";
import { EP_PriceTable } from "../Tables/quotes/subtables/Recursos/EP_PriceTable";
import { Structure_PriceTable } from "../Tables/quotes/subtables/Recursos/Structure_PriceTable";
import { Consume_PriceTable } from "../Tables/quotes/subtables/Recursos/Consume_PriceTable";
import { EPP_PriceTable } from "../Tables/quotes/subtables/Recursos/EPP_PriceTable";
import { Tooling_PriceTable } from "../Tables/quotes/subtables/Recursos/Tooling_PriceTable";
import { Personal_PriceTable } from "../Tables/quotes/subtables/Recursos/Personal_PriceTable";
import { SCTR_PriceTable } from "../Tables/quotes/subtables/Recursos/SCTR_PriceTable";
import { AddProductSelectField } from "@/features/view/components/Form_fields/AddSelectField";
import { EPP_REUSABLE_OPTIONS } from "@/lib/utils/options";

export function ResourcesTables({
    recursos,
    projectEquipos,
    projectMateriales,
    form,
    manualResourceCosts,
    updateManualCostItem,
    addManualCostItem,
    removeManualCostItem,
    updateConsiderarEppReutilizable,
    onUpdateEquipoCantidad,
    onUpdateMaterialCantidad,
    onAddEquipo,
    onRemoveEquipo,
    onAddMaterial,
    onReplaceMaterial,
    onRemoveMaterial,
    onAddConsumeItem,
}: ResourcesTablesProps) {
    return(
        <div className="mt-6 grid gap-6 grid-cols-[1fr_2fr]">
            <div className="rounded-2xl border border-slate-200 p-4">
                <SummaryCostTable1
                    recursosCosts={recursos}
                    form={form}
                />
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
                <CollapsibleTableSection title="Equipos Principales">
                    <EP_PriceTable
                        selected_equipos={projectEquipos}
                        onUpdateCantidad={onUpdateEquipoCantidad}
                        onAddEquipo={onAddEquipo}
                        onRemoveEquipo={onRemoveEquipo}
                    />
                </CollapsibleTableSection>
                <CollapsibleTableSection title="Estructuras">
                    <Structure_PriceTable
                        selected_equipos={projectEquipos}
                        onUpdateCantidad={onUpdateEquipoCantidad}
                        onAddEquipo={onAddEquipo}
                        onRemoveEquipo={onRemoveEquipo}
                    />
                </CollapsibleTableSection>
                <CollapsibleTableSection title="Consumibles">
                    <Consume_PriceTable
                        items={manualResourceCosts.Recursos.consumible}
                        selected_materiales={projectMateriales}
                        onUpdateCantidad={onUpdateMaterialCantidad}
                        onAddMaterial={onAddMaterial}
                        onReplaceMaterial={onReplaceMaterial}
                        onRemoveMaterial={onRemoveMaterial}
                        onAddConsumeItem={onAddConsumeItem}
                        onUpdateItem={(index, field, value) =>
                            updateManualCostItem("Recursos.consumible", index, field, value)
                        }
                        onRemoveItem={(index) => removeManualCostItem("Recursos.consumible", index)}
                    />
                </CollapsibleTableSection>
                <CollapsibleTableSection title="EPPs">
                    <div className="space-y-2 border-b border-slate-200 px-6 pt-4">
                        <AddProductSelectField
                            label="EPPs reutilizables (careta antiarco, botas dieléctricas y botas antiarco)"
                            value={
                                manualResourceCosts.Recursos.considerar_epp_reutilizable !== false
                                    ? "CONSIDERAR"
                                    : "NO CONSIDERAR"
                            }
                            options={EPP_REUSABLE_OPTIONS}
                            onChange={(value) =>
                                updateConsiderarEppReutilizable(value === "CONSIDERAR")
                            }
                        />
                        <p className="pb-3 text-sm text-slate-500">
                            Si se consideran, se deprecian con las herramientas y no entran al costo de EPPs.
                        </p>
                    </div>
                    <EPP_PriceTable
                        items={manualResourceCosts.Recursos.epp}
                        considerarEppReutilizable={
                            manualResourceCosts.Recursos.considerar_epp_reutilizable !== false
                        }
                        onUpdateItem={(index, field, value) => updateManualCostItem("Recursos.epp", index, field, value)}
                        onAddItem={() => addManualCostItem("Recursos.epp")}
                        onRemoveItem={(index) => removeManualCostItem("Recursos.epp", index)}
                    />
                </CollapsibleTableSection>
                <CollapsibleTableSection title="Herramientas">
                    <Tooling_PriceTable
                        items={manualResourceCosts.Recursos.tooling}
                        onUpdateItem={(index, field, value) => updateManualCostItem("Recursos.tooling", index, field, value)}
                        onAddItem={() => addManualCostItem("Recursos.tooling")}
                        onRemoveItem={(index) => removeManualCostItem("Recursos.tooling", index)}
                    />
                </CollapsibleTableSection>
                <CollapsibleTableSection title="Personal">
                    <Personal_PriceTable
                        items={manualResourceCosts.Recursos.personal}
                        onUpdateItem={(index, field, value) => updateManualCostItem("Recursos.personal", index, field, value)}
                        onAddItem={() => addManualCostItem("Recursos.personal")}
                        onRemoveItem={(index) => removeManualCostItem("Recursos.personal", index)}
                    />
                </CollapsibleTableSection>
                <CollapsibleTableSection title="SCTR">
                    <SCTR_PriceTable
                        items={manualResourceCosts.Recursos.sctr}
                        onUpdateItem={(index, field, value) => updateManualCostItem("Recursos.sctr", index, field, value)}
                        onAddItem={() => addManualCostItem("Recursos.sctr")}
                        onRemoveItem={(index) => removeManualCostItem("Recursos.sctr", index)}
                    />
                </CollapsibleTableSection>
            </div>
        </div>
    )
}
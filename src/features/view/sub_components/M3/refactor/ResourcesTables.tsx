import { ResourcesTablesProps } from "@/lib/types/components/module_render";
import { SummaryCostTable1 } from "../Tables/quotes/tables/SummaryCostTable1";
import { CollapsibleTableSection } from "@/features/view/components/Shells/CollapsibleTableSection";
import { EP_PriceTable } from "../Tables/quotes/subtables/Recursos/EP_PriceTable";
import { Structure_PriceTable } from "../Tables/quotes/subtables/Recursos/Structure_PriceTable";
import { Consume_PriceTable } from "../Tables/quotes/subtables/Recursos/Consume_PriceTable";
import { EPP_PriceTable } from "../Tables/quotes/subtables/Recursos/EPP_PriceTable";
import { Tooling_PriceTable } from "../Tables/quotes/subtables/Recursos/Tooling_PriceTable";
import { Hotel_PriceTable } from "../Tables/quotes/subtables/Recursos/Hotel_PriceTable";
import { Personal_PriceTable } from "../Tables/quotes/subtables/Recursos/Personal_PriceTable";
import { SCTR_PriceTable } from "../Tables/quotes/subtables/Recursos/SCTR_PriceTable";

export function ResourcesTables({
    recursos,
    projectEquipos,
    projectMateriales,
    manualResourceCosts,
    updateManualCostMonto,
    updateManualCostItem,
    addManualCostItem,
    removeManualCostItem,
}: ResourcesTablesProps) {
    return(
        <div className="mt-6 grid gap-6 grid-cols-[1fr_2fr]">
            <div className="rounded-2xl border border-slate-200 p-4">
                <SummaryCostTable1
                    recursosCosts={recursos}
                />
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
                <CollapsibleTableSection title="Equipos Principales">
                    <EP_PriceTable
                        selected_equipos={projectEquipos}
                    />
                </CollapsibleTableSection>
                <CollapsibleTableSection title="Estructuras">
                    <Structure_PriceTable
                        selected_equipos={projectEquipos}
                    />
                </CollapsibleTableSection>
                <CollapsibleTableSection title="Consumibles">
                    <Consume_PriceTable
                        selected_materiales={projectMateriales}
                    />
                </CollapsibleTableSection>
                <CollapsibleTableSection title="EPPs">
                    <EPP_PriceTable
                        items={manualResourceCosts.Recursos.epp}
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
                <CollapsibleTableSection title="Hotel">
                    <Hotel_PriceTable
                        manualResourceCosts={manualResourceCosts}
                        updateManualCostMonto={updateManualCostMonto}
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
import { ViaticosTablesProps } from "@/lib/types/components/module_render";
import { SummaryCostTable2 } from "../Tables/quotes/tables/SummaryCostTable2";
import { CollapsibleTableSection } from "@/features/view/components/Shells/CollapsibleTableSection";
import { Courier_PriceTable } from "../Tables/quotes/subtables/Viaticos/Courier_PriceTable";
import { Eating_PriceTable } from "../Tables/quotes/subtables/Viaticos/Eating_PriceTable";
import { Traveling_PriceTable } from "../Tables/quotes/subtables/Viaticos/Traveling_PriceTable";

export function ViaticosTables({
    viaticos,
    manualResourceCosts,
    updateManualCostMonto,
    updateManualCostItem,
    addManualCostItem,
    removeManualCostItem,
}: ViaticosTablesProps) {
    return(
        <div className="mt-6 grid gap-6 grid-cols-[1fr_2fr]">
            <div className="rounded-2xl border border-slate-200 p-4">
                <SummaryCostTable2
                    viaticosCosts={viaticos}
                />
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
                <CollapsibleTableSection title="Courier">
                    <Courier_PriceTable
                        items={manualResourceCosts.Viaticos.courier}
                        onUpdateItem={(index, field, value) => updateManualCostItem("Viaticos.courier", index, field, value)}
                        onAddItem={() => addManualCostItem("Viaticos.courier")}
                        onRemoveItem={(index) => removeManualCostItem("Viaticos.courier", index)}
                    />
                </CollapsibleTableSection>
                <CollapsibleTableSection title="Alimentación">
                    <Eating_PriceTable
                        manualResourceCosts={manualResourceCosts}
                        updateManualCostMonto={updateManualCostMonto}
                    />
                </CollapsibleTableSection>
                <CollapsibleTableSection title="Viajes y movilidad">
                    <Traveling_PriceTable
                        manualResourceCosts={manualResourceCosts}
                        updateManualCostMonto={updateManualCostMonto}
                    />
                </CollapsibleTableSection>
            </div>
        </div>
    )
}
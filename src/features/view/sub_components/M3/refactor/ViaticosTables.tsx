import { ViaticosTablesProps } from "@/lib/types/components/sub_components/module_render";
import { SummaryCostTable2 } from "../Tables/quotes/tables/SummaryCostTable2";
import { CollapsibleTableSection } from "@/features/view/components/Shells/CollapsibleTableSection";
import { Courier_PriceTable } from "../Tables/quotes/subtables/Viaticos/Courier_PriceTable";
import { Eating_PriceTable } from "../Tables/quotes/subtables/Viaticos/Eating_PriceTable";
import { Mobility_PriceTable } from "../Tables/quotes/subtables/Viaticos/Mobility_PriceTable";
import { Hotel_PriceTable } from "../Tables/quotes/subtables/Viaticos/Hotel_PriceTable";

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
                <CollapsibleTableSection title="Hotel">
                    <Hotel_PriceTable
                        manualResourceCosts={manualResourceCosts}
                        updateManualCostMonto={updateManualCostMonto}
                    />
                </CollapsibleTableSection>
                <CollapsibleTableSection title="Alimentación">
                    <Eating_PriceTable
                        items={manualResourceCosts.Viaticos.eating ?? []}
                        onUpdateItem={(index, field, value) => updateManualCostItem("Viaticos.eating", index, field, value)}
                        onAddItem={() => addManualCostItem("Viaticos.eating")}
                        onRemoveItem={(index) => removeManualCostItem("Viaticos.eating", index)}
                    />
                </CollapsibleTableSection>
                <CollapsibleTableSection title="Movilidad">
                    <Mobility_PriceTable
                        manualResourceCosts={manualResourceCosts}
                        updateManualCostMonto={updateManualCostMonto}
                    />
                </CollapsibleTableSection>
            </div>
        </div>
    )
}
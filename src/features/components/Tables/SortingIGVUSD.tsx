import { SortingIcon } from "@/features/components/Icons/SortingIcon";
import { shouldRender_ProductSortingSelection } from "@/lib/utils/renders";
import type { ProductSortingOrder } from "@/lib/utils/options"; // Tipados

type ProductSortingProps = {
    value: ProductSortingOrder;
    onSortingChange: (value: ProductSortingOrder) => void;
};

export function Sorting_IGV_USD({ value, onSortingChange }: ProductSortingProps) {
    const { label, nextOrder } = shouldRender_ProductSortingSelection(value);

    return (
        <button
            type="button"
            className="filter-control relative flex h-12 min-w-56 items-center rounded-xl border border-slate-200 bg-white px-4 pl-11 pr-4 text-left text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            onClick={() => onSortingChange(nextOrder)}
            title="Ordenar productos por precio USD con IGV"
        >
            <SortingIcon />
            <span>{label}</span>
        </button>
    );
}
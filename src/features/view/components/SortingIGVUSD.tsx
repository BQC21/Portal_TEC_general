import { SortingIcon } from "@/features/view/components/Icons/SortingIcon";
import { shouldRender_ProductSortingSelection } from "@/lib/utils/helpers/sorting/sorting";
import type { ProductSortingProps } from "@/lib/types/components/sorting"; // Tipados

export function Sorting_IGV_USD({ value, onSortingChange }: ProductSortingProps) {
    const { label, nextOrder } = shouldRender_ProductSortingSelection(value);

    const title = `Estado actual: ${label}. Haz clic para cambiar el orden.`;

    return (
        <button
            type="button"
            className="filter-control relative flex h-12 min-w-56 items-center rounded-xl border border-slate-200 bg-white px-4 pl-11 pr-4 text-left text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            onClick={() => onSortingChange(nextOrder)}
            title={title}
        >
            <SortingIcon />
            <span>{label}</span>
        </button>
    );
}
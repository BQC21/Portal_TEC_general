import { SortingIcon } from "@/features/view/components/Icons/SortingIcon";
import { shouldRender_DateSortingSelection } from "@/lib/utils/helpers/sorting/dateSorting";
import type { DateSortingProps } from "@/lib/types/components/Filter/sorting";

export function SortingByDate({ field, value, onSortingChange }: DateSortingProps) {
    const { label, nextOrder } = shouldRender_DateSortingSelection(field, value);
    const title = `Estado actual: ${label}. Haz clic para cambiar el orden.`;

    return (
        <div className="shrink-0">
            <button
                type="button"
                className="filter-control relative inline-flex h-12 w-max max-w-full items-center whitespace-nowrap rounded-xl border border-slate-200 bg-white px-4 pl-11 pr-4 text-left text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                onClick={() => onSortingChange(nextOrder)}
                title={title}
            >
                <SortingIcon />
                <span>{label}</span>
            </button>
        </div>
    );
}

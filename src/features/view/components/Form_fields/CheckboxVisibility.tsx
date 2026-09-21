import { VisibilityCheckboxProps, VisibilityId } from "@/lib/types/components/General/form_fields";

function toIdList(ids: VisibilityId | VisibilityId[]): string[] {
    return (Array.isArray(ids) ? ids : [ids]).map(String);
}

export function VisibilityCheckbox({
    label,
    fallbackLabel = "ítem",
    ids,
    hiddenIds = [],
    checked,
    onToggleVisibility,
}: VisibilityCheckboxProps) {
    const idList = toIdList(ids);
    const visibleInPdf = checked ?? idList.every((id) => !hiddenIds.includes(id));

    function handleChange() {
        idList.forEach((id) => {
            const currentlyVisible = !hiddenIds.includes(id);
            if (checked !== undefined || currentlyVisible === visibleInPdf) {
                onToggleVisibility?.(id);
            }
        });
    }

    return (
        <input
            type="checkbox"
            checked={visibleInPdf}
            onChange={handleChange}
            aria-label={`Mostrar ${label || fallbackLabel} en el PDF`}
            className="h-5 w-5 accent-orange-500"
        />
    );
}

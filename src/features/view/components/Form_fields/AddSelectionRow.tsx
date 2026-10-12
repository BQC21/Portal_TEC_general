import { SelectionRowProps } from "@/lib/types/components/General/form_fields";
import { actionButtonStyles, selectionRowStyles } from "@/lib/utils/consts/formFieldStyles";
import { AddProductSearchableSelectField } from "./AddSearchableSelectField";
import { AddProductSelectField } from "./AddSelectField";


export function SelectionRow({ label, buttonLabel, value, options, 
    onChange, onClick, customSelectClass, required = false, disabled = false, searchable = false }: SelectionRowProps) {
        const selectField = searchable ? (
            <AddProductSearchableSelectField
                label={label}
                required={required}
                value={value}
                options={options}
                onChange={onChange}
                customClass={customSelectClass}
                disabled={disabled}
                searchPlaceholder="Buscar..."
                emptyMessage="Sin resultados"
            />
        ) : (
            <AddProductSelectField
                label={label}
                required={required}
                value={value}
                options={options}
                onChange={onChange}
                customClass={customSelectClass}
                disabled={disabled}
            />
        );
        return (
            <div className={selectionRowStyles}>
                <div className="min-w-0">
                    {selectField}
                </div>
                <button type="button" className={actionButtonStyles} onClick={onClick}>
                    {buttonLabel}
                </button>
            </div>
        );
    }
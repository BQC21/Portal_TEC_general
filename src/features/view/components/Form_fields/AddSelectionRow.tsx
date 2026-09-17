import { SelectionRowProps } from "@/lib/types/components/General/form_fields";
import { actionButtonStyles, selectionRowStyles } from "@/lib/utils/consts/formFieldStyles";
import { AddProductSelectField } from "./AddSelectField";


export function SelectionRow({ label, buttonLabel, value, options, 
    onChange, onClick, customSelectClass, required = false, disabled = false }: SelectionRowProps) {
        return (
            <div className={selectionRowStyles}>
                <div className="min-w-0">
                    <AddProductSelectField
                        label={label}
                        required={required}
                        value={value}
                        options={options}
                        onChange={onChange}
                        customClass={customSelectClass}
                        disabled={disabled}
                    />
                </div>
                <button type="button" className={actionButtonStyles} onClick={onClick}>
                    {buttonLabel}
                </button>
            </div>
        );
    }
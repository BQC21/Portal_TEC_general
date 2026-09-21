import { FilterIcon } from "@/features/view/components/Icons/FilterIcon";
import { SelectorIcon } from "@/features/view/components/Icons/SelectorIcon";
import { SortingIcon } from "@/features/view/components/Icons/SortingIcon";

export type TableFilterSelectOption = {
    value: string;
    label: string;
};

type TableFilterSelectProps = {
    label: string;
    placeholder: string;
    value: string;
    options: Array<string | TableFilterSelectOption>;
    onChange: (value: string) => void;
    icon?: "filter" | "sort";
};

export function TableFilterSelect({
    label,
    placeholder,
    value,
    options,
    onChange,
    icon = "filter",
}: TableFilterSelectProps) {
    return (
        <label className="space-y-2">
            <span className="block text-center text-lg font-semibold text-slate-600">{label}</span>
            <div className="relative">
                {icon === "sort" ? <SortingIcon /> : <FilterIcon />}
                <select
                    className="filter-control h-12 w-full appearance-none pl-11 pr-10"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                >
                    <option value="">{placeholder}</option>
                    {options.map((option) => {
                        const optionValue = typeof option === "string" ? option : option.value;
                        const optionLabel = typeof option === "string" ? option : option.label;
                        return (
                            <option key={optionValue} value={optionValue}>
                                {optionLabel}
                            </option>
                        );
                    })}
                </select>
                <SelectorIcon />
            </div>
        </label>
    );
}

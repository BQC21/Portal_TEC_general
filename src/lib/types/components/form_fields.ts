
// campo de fecha
export type AddProductDateFieldProps = {
    label: string;
    required?: boolean;
    value: string;
    onChange: (value: string) => void;
    min?: string;
    max?: string;
    disabled?: boolean;
};

// campo de solo lectura
export type AddReadonlyFieldProps = {
    label: string;
    value: string;
    colorClass?: string; // Optional color class for conditional styling
};

//campo para agregar
export type AddProductFieldLabelProps = {
    label: string;
    required?: boolean;
};

// campo para números
export type AddProductNumberFieldProps = {
    label: string;
    required?: boolean;
    value: number | "";
    onChange: (value: number) => void;
    step?: number | "";
    min?: number | "";
    max?: number | "";
    disabled?: boolean;
};

// campo para radios de selección
export type AddProductRadioFieldProps = {
    label: string;
    checked: boolean;
    onChange: () => void;
};

// campo para título
export type AddProductSectionTitleProps = {
    title: string;
};

// campo para selectores
export type AddProductSelectFieldProps = {
    label: string;
    required?: boolean;
    options: string[];
    value: string;
    disabled?: boolean;
    onChange: (value: string) => void;
    customClass?: string; // Optional custom class for styling
};

// campo para texto
export type AddProductTextFieldProps = {
    label: string;
    required?: boolean;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
};
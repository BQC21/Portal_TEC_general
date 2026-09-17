import { ReactNode } from "react";

export type PortalShellProps = {
    title: string;
    subtitle: string;
    activePath: string;
    children: ReactNode;
};

// añadir modulos por rutas
export type PortalNavItem = {
    label: string;
    href: string;
};

export const navigation: PortalNavItem[] = [
    { label: "Vista principal", href: "/dashboard" },
    { label: "Proveedores", href: "/proveedores" },
    { label: "Equipos Principales", href: "/equipos" },
    { label: "Materiales Eléctricos", href: "/materiales" },
    { label: "Dimensionamiento", href: "/sizing" },
    { label: "Cotizaciones", href: "/quotes" }
];

// mostrar el contenido de las tablas desplegables 
export type CollapsibleTableSectionProps = {
    title: string;
    defaultOpen?: boolean;
    children: ReactNode;
    showCheckbox?: boolean;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    checkboxAriaLabel?: string;
};

export type ExcelWorkbookSheet = {
    id: string;
    label: string;
    content: ReactNode;
};

export type ExcelWorkbookProps = {
    sheets: ExcelWorkbookSheet[];
    defaultSheetId?: string;
};

export type ExcelResizableTablesProps = {
    children: ReactNode;
    className?: string;
};

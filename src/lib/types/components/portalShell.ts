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
    // { label: "Productos", href: "/products" }, // comentar en caso no se quiera mostrar el módulo de productos
    { label: "Equipos Principales", href: "/equipos" },
    { label: "Materiales Eléctricos", href: "/materiales" },
    { label: "Dimensionamiento", href: "/sizing" },
];

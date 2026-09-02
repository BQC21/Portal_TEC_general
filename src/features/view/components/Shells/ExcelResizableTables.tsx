"use client";

import { ReactNode, useEffect, useRef } from "react";
import { enableExcelTableResize } from "@/lib/utils/helpers/project_modals/excelTableResize";

type ExcelResizableTablesProps = {
    children: ReactNode;
    className?: string;
};

/** Contenedor que permite redimensionar columnas y filas de las tablas hijas como en Excel. */
export function ExcelResizableTables({ children, className }: ExcelResizableTablesProps) {
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        return enableExcelTableResize(root);
    }, []);

    return (
        <div ref={rootRef} className={className}>
            {children}
        </div>
    );
}

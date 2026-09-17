"use client";

import { useEffect, useRef } from "react";
import { ExcelResizableTablesProps } from "@/lib/types/components/General/Shell";
import { enableExcelTableResize } from "@/lib/utils/helpers/project_modals/excelTableResize";

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

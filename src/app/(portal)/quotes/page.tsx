"use client";

import { PortalShell } from "@/features/view/components/PortalShell";

export default function QuotesPage(){
    // ---------------------------------
    // ---- Usar Base de datos ---------
    // ---------------------------------  

    // ---------------------------------
    // ---- Lista de eventos ----
    // ---------------------------------

    //------- Agregar


    //------ Actualizar


    //------ Remover

    return (
        <PortalShell
            title="Proceso de cotización para los proyectos de dimensionamiento"
            subtitle="Calcule el precio de venta y genera su reporte de cotización en formato PDF"
            activePath="/quotes"
        >
            <main className="min-h-screen bg-background text-foreground">
                {/* Tabla de cotizaciones */}

                
                {/* Tabla de reportes */}

            </main>
        </PortalShell>
    )
}
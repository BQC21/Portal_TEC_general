"use client";

import { PortalShell } from "@/features/view/components/PortalShell";
// import { useProducts } from "@/features/view/hooks/services/useRealtimeProducts";
import { useEquipos } from "@/features/view/hooks/services/useRealtimeEquipos";
import { useMateriales } from "@/features/view/hooks/services/useRealtimeMateriales";
import { useProjects } from "@/features/view/hooks/services/useRealtimeProjects";
import { useQuotes } from "@/features/view/hooks/services/useRealtimeQuotes";
import { useReports } from "@/features/view/hooks/services/useRealtimeReports";
import { useZone } from "@/features/view/hooks/services/useRealtimeZonas";

export default function DashboardPage() {

    // const { products } = useProducts();
    const { equipos } = useEquipos();
    const { materiales } = useMateriales();
    const { projects } = useProjects();
    const { zones } = useZone();
    const { quotes } = useQuotes();
    const { reports } = useReports();
    const metrics = [
        // {
        //     title: "Productos Activos",
        //     value: products.length,
        //     accent: "bg-blue-50 text-blue-700",
        //     icon: "▣",
        // },
        {
            title: "Equipos eléctricos Activos",
            value: equipos.length,
            accent: "bg-blue-50 text-blue-700",
            icon: "▣",
        },
        {
            title: "Materiales eléctricos Activos",
            value: materiales.length,
            accent: "bg-blue-50 text-blue-700",
            icon: "▣",
        },

        {
            title: "Proyectos enlistados",
            value: projects.length,
            accent: "bg-emerald-50 text-emerald-700",
            icon: "▣",
        },
        {
            title: "Zonas enlistadas",
            value: zones.length,
            accent: "bg-emerald-50 text-emerald-700",
            icon: "▣",
        },
        {
            title: "Cotizaciones enlistadas",
            value: quotes.length,
            accent: "bg-red-50 text-red-700",
            icon: "▣",
        },
        {
            title: "Reportes enlistados",
            value: reports.length,
            accent: "bg-red-50 text-red-700",
            icon: "▣",
        },
    ];

    return (
        <PortalShell
            title="Panel de Control"
            subtitle="Bienvenido al portal corporativo de TEC Energy Solutions"
            activePath="/dashboard"
        >
            <section className="grid gap-6 lg:grid-cols-3">
                {metrics.map((metric) => (
                    <article
                        key={metric.title}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                        <div className="flex items-start justify-between">
                            <div className={`grid h-14 w-14 place-items-center rounded-2xl text-2xl ${metric.accent}`}>
                                {metric.icon}
                            </div>
                        </div>
                        <div className="mt-10">
                            <p className="text-3xl font-bold text-slate-900">{metric.value}</p>
                            <p className="mt-2 text-lg text-slate-500">{metric.title}</p>
                        </div>
                    </article>
                ))}
            </section>
        </PortalShell>
    );
}
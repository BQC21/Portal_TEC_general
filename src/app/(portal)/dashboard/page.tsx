"use client";

import { PortalShell } from "@/features/view/components/Shells/PortalShell";
// import { useProducts } from "@/features/view/hooks/services/useRealtimeProducts";
import { useEquipos } from "@/features/view/hooks/services/useRealtimeEquipos";
import { useFinantials } from "@/features/view/hooks/services/useRealtimeFinantial";
import { useMateriales } from "@/features/view/hooks/services/useRealtimeMateriales";
import { useProjects } from "@/features/view/hooks/services/useRealtimeProjects";
import { useQuotes } from "@/features/view/hooks/services/useRealtimeQuotes";
import { useReports } from "@/features/view/hooks/services/useRealtimeReports";
import { useZone } from "@/features/view/hooks/services/useRealtimeZonas";

export default function DashboardPage() {

    //-------
    // Estados
    // ------

    // const { products } = useProducts();
    const { equipos } = useEquipos();
    const { materiales } = useMateriales();
    const { projects } = useProjects();
    const { zones } = useZone();
    const { quotes } = useQuotes();
    const { reports } = useReports();
    const { finantials } = useFinantials();

    //-------
    // Metricas
    // ------

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
            bg_color: "#58C2FE"
        },
        {
            title: "Materiales eléctricos Activos",
            value: materiales.length,
            accent: "bg-blue-50 text-blue-700",
            icon: "▣",
            bg_color: "#58C2FE"
        },

        {
            title: "Proyectos enlistados",
            value: projects.length,
            accent: "bg-emerald-50 text-emerald-700",
            icon: "◈",
            bg_color: "#74FF88"
        },
        {
            title: "Zonas enlistadas",
            value: zones.length,
            accent: "bg-emerald-50 text-emerald-700",
            icon: "◈",
            bg_color: "#74FF88"
        },
        {
            title: "Cotizaciones enlistadas",
            value: quotes.length,
            accent: "bg-red-50 text-red-700",
            icon: "▤",
            bg_color: "#FF4885"
        },
        {
            title: "Reportes enlistados",
            value: reports.length,
            accent: "bg-red-50 text-red-700",
            icon: "▤",
            bg_color: "#FF4885"
        },
        {
            title: "Finanzas enlistadas",
            value: finantials.length,
            accent: "bg-red-50 text-red-700",
            icon: "▤",
            bg_color: "#FF4885"
        },
    ];

    const metricColumns: Array<{ icon: string; metrics: typeof metrics }> = [];
    const indexByIcon = new Map<string, number>();

    for (const metric of metrics) {
        const existingIndex = indexByIcon.get(metric.icon);
        if (existingIndex === undefined) {
            indexByIcon.set(metric.icon, metricColumns.length);
            metricColumns.push({ icon: metric.icon, metrics: [metric] });
            continue;
        }
        metricColumns[existingIndex].metrics.push(metric);
    }

    return (
        <PortalShell
            title="Panel de Control"
            subtitle="Bienvenido al portal corporativo de TEC Energy Solutions"
            activePath="/dashboard"
        >
            <section className="grid gap-6 lg:grid-cols-3">
                {metricColumns.map((column) => (
                    <div key={column.icon} className="flex flex-col gap-6">
                        {column.metrics.map((metric) => (
                            <article
                                key={metric.title}
                                className="rounded-2xl border border-slate-800 p-6 shadow-sm"
                                style={{ backgroundColor: metric.bg_color }}
                            >
                                <div className="flex items-start justify-between">
                                    <div className={`grid h-14 w-14 place-items-center rounded-2xl text-2xl ${metric.accent}`}>
                                        {metric.icon}
                                    </div>
                                </div>
                                <div className="mt-10">
                                    <p className="text-3xl font-bold text-slate-900">{metric.value}</p>
                                    <p className="mt-2 text-lg text-slate-900">{metric.title}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                ))}
            </section>
        </PortalShell>
    );
}

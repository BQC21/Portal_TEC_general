import { PortalShell } from "@/app/components/PortalShell";

const metrics = [
    {
        title: "Productos Activos",
        value: "247",
        delta: "+12%",
        accent: "bg-blue-50 text-blue-700",
        icon: "▣",
    },
    {
        title: "Proyectos en Curso",
        value: "18",
        delta: "+3",
        accent: "bg-emerald-50 text-emerald-700",
        icon: "∿",
    },
    {
        title: "Cotizaciones",
        value: "34",
        delta: "+15%",
        accent: "bg-sky-50 text-sky-700",
        icon: "↗",
    },
];

export default function DashboardPage() {
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
                            <span className="text-lg font-semibold text-emerald-600">
                                {metric.delta}
                            </span>
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
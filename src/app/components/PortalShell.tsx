import Link from "next/link";
import type { ReactNode } from "react";

type PortalNavItem = {
    label: string;
    href: string;
};

const navigation: PortalNavItem[] = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Productos", href: "/products" },
];

type PortalShellProps = {
    title: string;
    subtitle: string;
    activePath: string;
    children: ReactNode;
};

export function PortalShell({ title, subtitle, activePath, children }: PortalShellProps) {
    return (
        <main className="min-h-screen bg-[#f6f8fc] text-slate-900">
        <div className="flex min-h-screen flex-col">
            <header className="flex h-24 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 text-2xl font-bold text-white shadow-md">
                ☼
                </div>
                <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
                    TEC Energy Solutions
                </h1>
                <p className="text-sm text-slate-500">Portal Corporativo</p>
                </div>
            </div>
            </header>

            <div className="grid flex-1 grid-cols-1 lg:grid-cols-[320px_1fr]">
            <aside className="border-r border-slate-200 bg-[#f8fafc] px-4 py-6">
                <nav className="space-y-4">
                {navigation.map((item) => {
                    const isActive = item.href === activePath;

                    return (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={[
                        "flex items-center gap-4 rounded-2xl px-6 py-4 text-lg font-semibold transition",
                        isActive
                            ? "bg-[#2f4ea8] text-white shadow-lg shadow-[#2f4ea8]/20"
                            : "text-slate-400 hover:bg-slate-100 hover:text-slate-700",
                        ].join(" ")}
                    >
                        <span className="text-2xl">{isActive ? "⌂" : "◻"}</span>
                        <span>{item.label}</span>
                    </Link>
                    );
                })}
                </nav>
            </aside>

            <section className="px-6 py-8 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-8">
                <div>
                    <h2 className="text-4xl font-bold tracking-tight text-slate-900">{title}</h2>
                    <p className="mt-4 text-xl text-slate-500">{subtitle}</p>
                </div>

                {children}
                </div>
            </section>
            </div>
        </div>
        </main>
    );
}
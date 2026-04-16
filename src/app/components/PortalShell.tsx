"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { createClient } from "@/lib/supabase/client";

import  TECIcon  from "@/features/components/Images/TEC_Icon";

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
    const router = useRouter();
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [isSigningOut, setIsSigningOut] = useState(false);

    useEffect(() => {
        const supabase = createClient();
        let isMounted = true;

        void supabase.auth.getUser().then(({ data }) => {
            if (isMounted) {
                setUserEmail(data.user?.email ?? null);
            }
        });

        return () => {
            isMounted = false;
        };
    }, []);

    async function handleSignOut() {
        try {
            setIsSigningOut(true);

            const supabase = createClient();
            await supabase.auth.signOut();

            router.replace("/login");
            router.refresh();
        } finally {
            setIsSigningOut(false);
        }
    }

    return (
        <main className="min-h-screen bg-[#f6f8fc] text-slate-900">
            <div className="flex min-h-screen flex-col">
                <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-6 py-4 shadow-sm md:h-24 md:flex-row md:items-center md:justify-between md:py-0">
                    <div className="flex items-center gap-4">
                        <TECIcon />
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-800">
                                TEC Energy Solutions
                            </h1>
                            <p className="text-sm text-slate-500">Portal Corporativo</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 self-start md:self-auto">
                        <div className="hidden text-right sm:block">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Sesión activa</p>
                            <p className="text-sm font-semibold text-slate-700">
                                {userEmail ?? "Usuario autenticado"}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleSignOut}
                            disabled={isSigningOut}
                            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSigningOut ? "Saliendo..." : "Cerrar sesión"}
                        </button>
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
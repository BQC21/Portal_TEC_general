import { redirect } from "next/navigation";

import { LoginForm } from "@/app/components/LoginForm";
import { createClient } from "@/lib/supabase/server";

import TECLogo from "@/features/components/Images/TEC_logo";

export default async function LoginPage() {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();

    if (data.user) {
        redirect("/dashboard");
    }

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#e7efff,_#f6f8fc_40%,_#eef2f7_100%)] px-6 py-10 text-slate-900">
            <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center">
                <div className="grid w-full gap-8 rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur md:grid-cols-[1.1fr_0.9fr] md:p-10">
                    <section className="flex flex-col justify-between rounded-[1.5rem] bg-[#0f172a] p-8 text-white">
                        <div className="space-y-6">
                            <TECLogo/>

                            <div className="space-y-4">
                                <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                                    Acceso seguro al portal corporativo
                                </h1>
                                <p className="max-w-xl text-base leading-7 text-slate-300 md:text-lg">
                                    Ingresa para consultar productos, controlar proyectos y administrar la información operativa de la empresa desde una sesión autenticada.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="flex items-center justify-center">
                        <div className="w-full max-w-md rounded-[1.5rem] border border-slate-200 bg-white p-8 shadow-sm">
                            <div className="mb-8 space-y-2">
                                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Iniciar sesión</h2>
                                <p className="text-sm leading-6 text-slate-500">
                                    Usa tu correo corporativo y tu contraseña para entrar al portal.
                                </p>
                            </div>

                            <LoginForm />
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
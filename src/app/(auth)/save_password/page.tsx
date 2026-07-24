"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";

export default function SavePasswordPage() {
    const [email, setEmail] = useState("");
    
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setIsLoading(true);
            setErrorMessage(null);
            setSuccessMessage(null);

            const supabase = createClient();
            const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
                redirectTo: `${window.location.origin}/callback?next=/update_password`,
            });

            if (error) {
                setErrorMessage(error.message);
                return;
            }

            setSuccessMessage(
                "Si el correo existe en el sistema, te enviamos un enlace para restablecer la contraseña."
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#e7efff,_#f6f8fc_40%,_#eef2f7_100%)] px-6 py-10 text-slate-900">
            <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center">
                <div className="w-full rounded-[1.5rem] border border-slate-200 bg-white p-8 shadow-sm">
                    <div className="mb-8 space-y-2">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            Recuperar contraseña
                        </h1>
                        <p className="text-sm leading-6 text-slate-500">
                            Ingresa tu correo corporativo y te enviaremos un enlace para crear una nueva
                            contraseña.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                                Correo corporativo
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                autoComplete="email"
                                placeholder="usuario@empresa.com"
                                className="input-focus-brand w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 transition placeholder:text-slate-400"
                                required
                            />
                        </div>

                        {errorMessage ? (
                            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                                {errorMessage}
                            </p>
                        ) : null}

                        {successMessage ? (
                            <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                                {successMessage}
                            </p>
                        ) : null}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full items-center justify-center rounded-2xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isLoading ? "Enviando..." : "Enviar enlace"}
                        </button>

                        <Link
                            href="/login"
                            className="block text-center text-sm font-medium text-brand-500 hover:underline"
                        >
                            Volver al inicio de sesión
                        </Link>
                    </form>
                </div>
            </div>
        </main>
    );
}
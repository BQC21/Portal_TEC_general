"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { EyeIcon } from "@/features/view/components/Form_fields/EyeIcon";
import { EyeSlashIcon } from "@/features/view/components/Form_fields/EyeSlashIcon";

export default function UpdatePasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (password.length < 8) {
            setErrorMessage("La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Las contraseñas no coinciden.");
            return;
        }

        try {
            setIsLoading(true);
            setErrorMessage(null);

            const supabase = createClient();
            const { error } = await supabase.auth.updateUser({ password });

            if (error) {
                setErrorMessage(error.message);
                return;
            }

            router.replace("/login");
            router.refresh();
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
                            Nueva contraseña
                        </h1>
                        <p className="text-sm leading-6 text-slate-500">
                            Define una nueva contraseña para tu cuenta del portal.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                                Nueva contraseña
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    autoComplete="new-password"
                                    placeholder="Nueva contraseña"
                                    className="input-focus-brand w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-12 text-slate-900 transition placeholder:text-slate-400"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-700"
                                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="confirmPassword"
                                className="text-sm font-semibold text-slate-700"
                            >
                                Confirmar contraseña
                            </label>
                            <input
                                id="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(event) => setConfirmPassword(event.target.value)}
                                autoComplete="new-password"
                                placeholder="Repite la contraseña"
                                className="input-focus-brand w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 transition placeholder:text-slate-400"
                                required
                            />
                        </div>

                        {errorMessage ? (
                            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                                {errorMessage}
                            </p>
                        ) : null}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full items-center justify-center rounded-2xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isLoading ? "Guardando..." : "Guardar contraseña"}
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
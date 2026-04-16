"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setIsLoading(true);
            setErrorMessage(null);

            const supabase = createClient();
            const normalizedEmail = email.trim();

            const { error } = await supabase.auth.signInWithPassword({
                email: normalizedEmail,
                password,
            });

            if (error) {
                if (error.message.toLowerCase().includes("invalid login credentials")) {
                    setErrorMessage(
                        "Ese usuario no existe en Supabase Auth o la contraseña no coincide. Revisa que la cuenta esté creada en Authentication, no solo en la tabla public.usuarios."
                    );
                    return;
                }

                setErrorMessage(error.message);
                return;
            }

            router.replace("/dashboard");
            router.refresh();
        } finally {
            setIsLoading(false);
        }
    }

    return (
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
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2f4ea8] focus:ring-4 focus:ring-[#2f4ea8]/10"
                    required
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                    Contraseña
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    placeholder="Tu contraseña"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2f4ea8] focus:ring-4 focus:ring-[#2f4ea8]/10"
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
                className="flex w-full items-center justify-center rounded-2xl bg-[#2f4ea8] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2f4ea8]/20 transition hover:bg-[#254192] disabled:cursor-not-allowed disabled:opacity-70"
            >
                {isLoading ? "Ingresando..." : "Ingresar al portal"}
            </button>
            {/* <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center rounded-2xl bg-[#2f4ea8] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2f4ea8]/20 transition hover:bg-[#254192] disabled:cursor-not-allowed disabled:opacity-70"
            >
                {isLoading ? "Cargando..." : "Registrar cuenta nueva"}
            </button>
            <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center rounded-2xl bg-[#2f4ea8] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2f4ea8]/20 transition hover:bg-[#254192] disabled:cursor-not-allowed disabled:opacity-70"
            >
                {isLoading ? "Cargando..." : "Actualizar contraseña"}
            </button> */}
        </form>
    );
}
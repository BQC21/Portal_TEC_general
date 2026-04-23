"use client";
import { useEffect, useState } from "react";
import { SunatRate } from "@/lib/types/product-types"; 

export function SunatCard() {
    const [rate, setRate] = useState<number>(0);
    const [buyPrice, setBuyPrice] = useState<number>(0);
    const [sellPrice, setSellPrice] = useState<number>(0);
    const [date, setDate] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch("/api/sunat");
                if (!res.ok) throw new Error("No se pudo obtener el tipo de cambio");

                const data = (await res.json()) as SunatRate;
                const buy = Number(data.buy_price);
                const sell = Number(data.sell_price);

                if (Number.isNaN(buy) || Number.isNaN(sell)) {
                    throw new Error("Respuesta inválida de SUNAT");
                }

                setBuyPrice(buy);
                setSellPrice(sell);
                setDate(data.date);
                setRate(sell);
            } catch (err) {
                const message = err instanceof Error ? err.message : "Error cargando SUNAT";
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        void load();
    }, []);

    return {
        rate,
        buyPrice,
        sellPrice,
        date,
        loading,
        error,
    };
}
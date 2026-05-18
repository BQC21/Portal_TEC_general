"use client";

import { useCallback, useEffect, useState } from "react";

import { exchange_rate } from "@/app/api/APIFrankfurterRoute";

export function useConverter(priceBase: string, priceQuote: string) {
    const [exchangeRate, setExchangeRate] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchExchangeRate = useCallback(async () => {
    try {
        setLoading(true);
        setError(null);

        const rate = await exchange_rate(priceBase, priceQuote);
        setExchangeRate(rate);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Error al obtener la tasa de conversión";
        setError(message);
    } finally {
        setLoading(false);
    }
    }, [priceBase, priceQuote]);

    useEffect(() => {
        void fetchExchangeRate();
    }, [fetchExchangeRate]);

    return {
        exchangeRate,
        loading,
        error,
        refetch: fetchExchangeRate,
    };
}
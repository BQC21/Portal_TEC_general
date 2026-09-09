import { useCallback, useEffect, useState } from "react";

export const MONTH_LABELS = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
] as const;

type MonthlyValue = number | "";

function toMonthlyNumber(value: unknown): MonthlyValue {
    const n = typeof value === "number" ? value : Number(value);
    return Number.isFinite(n) && n > 0 ? n : "";
}

function toMonthlyValues(initial?: number[]): MonthlyValue[] {
    const base = new Array<MonthlyValue>(12).fill("");
    if (!initial?.length) return base;
    return base.map((_, i) => toMonthlyNumber(initial[i]));
}

export function monthsFromFactor(factor: number): number[] {
    const value = Number.isFinite(factor) && factor > 0 ? factor : 0;
    return Array.from({ length: 12 }, () => value);
}

export function useMonthlyDemand(
    onAnnualChange: (value: string) => void,
    onMonthlyChange: (value: number[]) => void,
    initialMonths?: number[],
    enabled = true,
) {
    const [monthlyValues, setMonthlyValues] = useState<MonthlyValue[]>(
        () => toMonthlyValues(initialMonths),
    );

    const updateMonth = useCallback(
        (index: number, value: number) => {
            setMonthlyValues((prev) => {
                const next = [...prev];
                next[index] = value > 0 ? value : "";
                return next;
            });
        },
        [],
    );

    useEffect(() => {
        if (!enabled) return;
        setMonthlyValues(toMonthlyValues(initialMonths));
    }, [enabled]);

    useEffect(() => {
        if (!enabled) return;
        const asNumbers = monthlyValues.map((m) => (typeof m === "number" ? m : 0));
        const total = asNumbers.reduce((sum, m) => sum + m, 0);
        onAnnualChange(String(total));
        onMonthlyChange(asNumbers);
    }, [enabled, monthlyValues]);

    const annualTotal = monthlyValues.reduce<number>(
        (sum, monthValue) => sum + (typeof monthValue === "number" ? monthValue : 0),
        0,
    );

    return { monthlyValues, updateMonth, annualTotal };
}

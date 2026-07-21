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

function toMonthlyValues(initial?: number[]): MonthlyValue[] {
    const base = new Array<MonthlyValue>(12).fill("");
    if (!initial?.length) return base;
    return base.map((_, i) => {
        const v = initial[i];
        return typeof v === "number" && v > 0 ? v : "";
    });
}

export function useMonthlyDemand(
    onAnnualChange: (value: string) => void,
    onMonthlyChange: (value: number[]) => void,
    initialMonths?: number[], 
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
        const asNumbers = monthlyValues.map((m) => (typeof m === "number" ? m : 0));
        const total = asNumbers.reduce((sum, m) => sum + m, 0);
        onAnnualChange(String(total));
        onMonthlyChange(asNumbers);
    }, [monthlyValues]); // sync al form después del render

    const annualTotal = monthlyValues.reduce<number>(
        (sum, monthValue) => sum + (typeof monthValue === "number" ? monthValue : 0),
        0,
    );

    return { monthlyValues, updateMonth, annualTotal };
}

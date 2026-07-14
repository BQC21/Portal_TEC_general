import { useCallback, useState } from "react";

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

export function useMonthlyDemand(onAnnualChange: (value: string) => void) {
    const [monthlyValues, setMonthlyValues] = useState<MonthlyValue[]>(
        () => new Array<MonthlyValue>(12).fill(""),
    );

    const updateMonth = useCallback(
        (index: number, value: number) => {
            setMonthlyValues((prev) => {
                const next = [...prev];
                next[index] = value > 0 ? value : "";
                const total = next.reduce<number>(
                    (sum, monthValue) => sum + (typeof monthValue === "number" ? monthValue : 0),
                    0,
                );
                onAnnualChange(String(total));
                return next;
            });
        },
        [onAnnualChange],
    );

    const annualTotal = monthlyValues.reduce<number>(
        (sum, monthValue) => sum + (typeof monthValue === "number" ? monthValue : 0),
        0,
    );

    return { monthlyValues, updateMonth, annualTotal };
}

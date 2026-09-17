import { useCallback, useEffect, useState } from "react";
import { MonthlyValue } from "@/lib/types/components/Sizing/computes";
import { toMonthlyValues } from "@/lib/utils/helpers/computes/energy_requirements";

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

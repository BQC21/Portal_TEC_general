import { ChartPoint, ChartScale } from "@/lib/types/components/Quotes/finantial_analysis";

export function buildScale(
    values: number[],
    height: number,
    paddingTop: number,
    paddingBottom: number,
): ChartScale {
    const min = Math.min(...values, 0);
    const max = Math.max(...values, 0);
    const span = max - min || 1;
    const usable = height - paddingTop - paddingBottom;

    return {
        min,
        max,
        toY: (value: number) =>
            paddingTop + ((max - value) / span) * usable,
    };
}

export function buildAxisTicks(min: number, max: number, targetCount = 8): number[] {
    const span = max - min || 1;
    const roughStep = span / Math.max(targetCount - 1, 1);
    const magnitude = Math.pow(10, Math.floor(Math.log10(Math.abs(roughStep) || 1)));
    const niceStep =
        [1, 2, 2.5, 5, 10]
            .map((factor) => factor * magnitude)
            .find((candidate) => candidate >= roughStep) ?? roughStep;

    const start = Math.floor(min / niceStep) * niceStep;
    const end = Math.ceil(max / niceStep) * niceStep;
    const ticks: number[] = [];

    for (let value = start; value <= end + niceStep * 1e-9; value += niceStep) {
        ticks.push(Number(value.toFixed(10)));
    }

    return ticks;
}

export type { ChartPoint };

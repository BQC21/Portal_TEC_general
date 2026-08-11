"use client";

import { formatCurrency } from "@/lib/utils/normalization";

// punteros
type Point = { x: number; y: number; label?: string };

// escalamiento
function buildScale(
    values: number[],
    height: number,
    paddingTop: number,
    paddingBottom: number
) {
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

/** Marcas "redondas" para el eje Y (p. ej. -20000, 0, 20000, …). */
function buildAxisTicks(min: number, max: number, targetCount = 8): number[] {
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

export function EnergyLineChart({
    years,
    values,
}: {
    years: number[];
    values: number[];
}) {
    if (values.length === 0) {
        return (
            <p className="text-sm text-slate-500">
                Completa generación y degradación para ver la gráfica.
            </p>
        );
    }

    const width = 420;
    const height = 220;
    const paddingX = 36;
    const paddingTop = 16;
    const paddingBottom = 28;
    const scale = buildScale(values, height, paddingTop, paddingBottom);
    const step =
        values.length > 1
            ? (width - paddingX * 2) / (values.length - 1)
            : 0;

    const points: Point[] = values.map((value, index) => ({
        x: paddingX + index * step,
        y: scale.toY(value),
        label: String(years[index]),
    }));

    const path = points
        .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
        .join(" ");

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full">
            <line
                x1={paddingX}
                y1={scale.toY(0)}
                x2={width - paddingX}
                y2={scale.toY(0)}
                stroke="#cbd5e1"
                strokeWidth={1}
            />
            <path d={path} fill="none" stroke="#0f766e" strokeWidth={2.5} />
            {points.map((point) => (
                <circle
                    key={point.label}
                    cx={point.x}
                    cy={point.y}
                    r={2.5}
                    fill="#0f766e"
                />
            ))}
            {points
                .filter((_, index) => index % 5 === 0 || index === points.length - 1)
                .map((point) => (
                    <text
                        key={`label-${point.label}`}
                        x={point.x}
                        y={height - 8}
                        textAnchor="middle"
                        className="fill-slate-500 text-[10px]"
                    >
                        {point.label}
                    </text>
                ))}
        </svg>
    );
}


export function FlowComboChart({
    years,
    flujoTotal,
    flujoAcumulado,
}: {
    years: number[];
    flujoTotal: number[];
    flujoAcumulado: number[];
}) {
    if (flujoTotal.length === 0) {
        return (
            <p className="text-sm text-slate-500">
                Completa los datos para ver la gráfica de flujos.
            </p>
        );
    }

    // propiedades de escalamiento
    const width = 640;
    const height = 300;
    const paddingLeft = 78;
    const paddingRight = 16;
    const paddingTop = 16;
    const paddingBottom = 48;
    const plotWidth = width - paddingLeft - paddingRight;
    const allValues = [...flujoTotal, ...flujoAcumulado];
    const scale = buildScale(allValues, height, paddingTop, paddingBottom);
    const yTicks = buildAxisTicks(scale.min, scale.max);
    const slotWidth = plotWidth / flujoTotal.length;
    const xLabelStep = years.length > 16 ? 2 : 1;

    // ancho de barra
    const barWidth = Math.max(4, slotWidth * 0.55);

    // ubicación de puntos
    const linePoints = flujoAcumulado.map((value, index) => {
        const x = paddingLeft + (index + 0.5) * slotWidth;
        return { x, y: scale.toY(value) };
    });

    // línea como tal
    const path = linePoints
        .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
        .join(" ");

    return (
        <div className="space-y-2">
            <svg viewBox={`0 0 ${width} ${height}`} className="h-72 w-full">
                {/* Rejilla horizontal + etiquetas Y ($) */}
                {yTicks.map((tick) => {
                    const y = scale.toY(tick);
                    const isZero = Math.abs(tick) < 1e-9;
                    return (
                        <g key={`y-tick-${tick}`}>
                            <line
                                x1={paddingLeft}
                                y1={y}
                                x2={width - paddingRight}
                                y2={y}
                                stroke={isZero ? "#94a3b8" : "#e2e8f0"}
                                strokeWidth={isZero ? 1.25 : 1}
                            />
                            <text
                                x={paddingLeft - 8}
                                y={y + 3}
                                textAnchor="end"
                                className="fill-slate-600 text-[9px]"
                            >
                                {formatCurrency(tick, "USD")}
                            </text>
                        </g>
                    );
                })}

                {/* Rejilla vertical + etiquetas X (años) */}
                {years.map((year, index) => {
                    const x = paddingLeft + (index + 0.5) * slotWidth;
                    const showLabel = index % xLabelStep === 0 || index === years.length - 1;
                    return (
                        <g key={`x-tick-${year}`}>
                            <line
                                x1={x}
                                y1={paddingTop}
                                x2={x}
                                y2={height - paddingBottom}
                                stroke="#e2e8f0"
                                strokeWidth={1}
                            />
                            {showLabel && (
                                <text
                                    x={x}
                                    y={height - paddingBottom + 14}
                                    textAnchor="end"
                                    transform={`rotate(-40 ${x} ${height - paddingBottom + 14})`}
                                    className="fill-slate-600 text-[9px]"
                                >
                                    {year}
                                </text>
                            )}
                        </g>
                    );
                })}

                {flujoTotal.map((value, index) => {
                    const x =
                        paddingLeft +
                        index * slotWidth +
                        (slotWidth - barWidth) / 2;
                    const y0 = scale.toY(0);
                    const y1 = scale.toY(value);
                    const top = Math.min(y0, y1);
                    const barHeight = Math.abs(y1 - y0);
                    return (
                        <rect
                            key={`bar-${years[index]}`}
                            x={x}
                            y={top}
                            width={barWidth}
                            height={barHeight || 1}
                            fill="#38bdf8"
                            opacity={0.85}
                        />
                    );
                })}
                <path d={path} fill="none" stroke="#be123c" strokeWidth={2.5} />
            </svg>
            <div className="flex gap-4 text-xs text-slate-600">
                <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-sm bg-sky-400" /> Flujo total
                </span>
                <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-sm bg-rose-700" /> Flujo acumulado
                </span>
            </div>
        </div>
    );
}

export function FlowComponentsChart({
    years,
    equipamiento,
    om,
    ahorro,
}: {
    years: number[];
    equipamiento: number[];
    om: number[];
    ahorro: number[];
}) {
    if (years.length === 0) {
        return null;
    }

    const width = 640;
    const height = 300;
    const paddingLeft = 78;
    const paddingRight = 16;
    const paddingTop = 16;
    const paddingBottom = 48;
    const plotWidth = width - paddingLeft - paddingRight;
    const allValues = [...equipamiento, ...om, ...ahorro];
    const scale = buildScale(allValues, height, paddingTop, paddingBottom);
    const yTicks = buildAxisTicks(scale.min, scale.max);
    const slotWidth = plotWidth / years.length;
    const xLabelStep = years.length > 16 ? 2 : 1;
    const seriesGap = 1;
    const barWidth = Math.max(2, (slotWidth - seriesGap * 4) / 3);

    const series = [
        { key: "equipamiento", values: equipamiento, fill: "#1d4ed8" },
        { key: "om", values: om, fill: "#94a3b8" },
        { key: "ahorro", values: ahorro, fill: "#ea580c" },
    ] as const;

    function barRect(value: number, seriesIndex: number, yearIndex: number) {
        const groupStart =
            paddingLeft + yearIndex * slotWidth + (slotWidth - barWidth * 3 - seriesGap * 2) / 2;
        const x = groupStart + seriesIndex * (barWidth + seriesGap);
        const y0 = scale.toY(0);
        const y1 = scale.toY(value);
        const top = Math.min(y0, y1);
        const barHeight = Math.abs(y1 - y0);
        return { x, y: top, height: barHeight || 1 };
    }

    return (
        <div className="space-y-2">
            <svg viewBox={`0 0 ${width} ${height}`} className="h-72 w-full">
                {/* Rejilla horizontal + etiquetas Y ($) */}
                {yTicks.map((tick) => {
                    const y = scale.toY(tick);
                    const isZero = Math.abs(tick) < 1e-9;
                    return (
                        <g key={`components-y-${tick}`}>
                            <line
                                x1={paddingLeft}
                                y1={y}
                                x2={width - paddingRight}
                                y2={y}
                                stroke={isZero ? "#94a3b8" : "#e2e8f0"}
                                strokeWidth={isZero ? 1.25 : 1}
                            />
                            <text
                                x={paddingLeft - 8}
                                y={y + 3}
                                textAnchor="end"
                                className="fill-slate-600 text-[9px]"
                            >
                                {formatCurrency(tick, "USD")}
                            </text>
                        </g>
                    );
                })}

                {/* Rejilla vertical + etiquetas X (años) */}
                {years.map((year, index) => {
                    const x = paddingLeft + (index + 0.5) * slotWidth;
                    const showLabel = index % xLabelStep === 0 || index === years.length - 1;
                    return (
                        <g key={`components-x-${year}`}>
                            <line
                                x1={x}
                                y1={paddingTop}
                                x2={x}
                                y2={height - paddingBottom}
                                stroke="#e2e8f0"
                                strokeWidth={1}
                            />
                            {showLabel && (
                                <text
                                    x={x}
                                    y={height - paddingBottom + 14}
                                    textAnchor="end"
                                    transform={`rotate(-40 ${x} ${height - paddingBottom + 14})`}
                                    className="fill-slate-600 text-[9px]"
                                >
                                    {year}
                                </text>
                            )}
                        </g>
                    );
                })}

                {/* Barras agrupadas: equipamiento / O&M / ahorro */}
                {series.map((serie, seriesIndex) =>
                    serie.values.map((value, yearIndex) => {
                        const { x, y, height: barHeight } = barRect(
                            value,
                            seriesIndex,
                            yearIndex
                        );
                        return (
                            <rect
                                key={`${serie.key}-${years[yearIndex]}`}
                                x={x}
                                y={y}
                                width={barWidth}
                                height={barHeight}
                                fill={serie.fill}
                                opacity={0.9}
                            />
                        );
                    })
                )}
            </svg>
            <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-sm bg-blue-700" /> Equipamiento
                </span>
                <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-sm bg-slate-400" /> O&amp;M
                </span>
                <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-sm bg-orange-600" /> Ahorro
                </span>
            </div>
        </div>
    );
}

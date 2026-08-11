"use client";

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

    const width = 520;
    const height = 240;
    const paddingX = 40;
    const paddingTop = 16;
    const paddingBottom = 30;
    const allValues = [...flujoTotal, ...flujoAcumulado];
    const scale = buildScale(allValues, height, paddingTop, paddingBottom);
    const barWidth =
        flujoTotal.length > 0
            ? Math.max(4, ((width - paddingX * 2) / flujoTotal.length) * 0.55)
            : 4;

    const linePoints = flujoAcumulado.map((value, index) => {
        const x =
            paddingX +
            (index + 0.5) * ((width - paddingX * 2) / flujoTotal.length);
        return { x, y: scale.toY(value) };
    });

    const path = linePoints
        .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
        .join(" ");

    return (
        <div className="space-y-2">
            <svg viewBox={`0 0 ${width} ${height}`} className="h-60 w-full">
                <line
                    x1={paddingX}
                    y1={scale.toY(0)}
                    x2={width - paddingX}
                    y2={scale.toY(0)}
                    stroke="#cbd5e1"
                    strokeWidth={1}
                />
                {flujoTotal.map((value, index) => {
                    const x =
                        paddingX +
                        index * ((width - paddingX * 2) / flujoTotal.length) +
                        (((width - paddingX * 2) / flujoTotal.length) - barWidth) / 2;
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

    const width = 520;
    const height = 220;
    const paddingX = 40;
    const paddingTop = 16;
    const paddingBottom = 28;
    const allValues = [...equipamiento, ...om, ...ahorro];
    const scale = buildScale(allValues, height, paddingTop, paddingBottom);

    function linePath(values: number[]) {
        return values
            .map((value, index) => {
                const x =
                    paddingX +
                    (years.length > 1
                        ? (index * (width - paddingX * 2)) / (years.length - 1)
                        : 0);
                const y = scale.toY(value);
                return `${index === 0 ? "M" : "L"} ${x} ${y}`;
            })
            .join(" ");
    }

    return (
        <div className="space-y-2">
            <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full">
                <line
                    x1={paddingX}
                    y1={scale.toY(0)}
                    x2={width - paddingX}
                    y2={scale.toY(0)}
                    stroke="#cbd5e1"
                    strokeWidth={1}
                />
                <path d={linePath(equipamiento)} fill="none" stroke="#1d4ed8" strokeWidth={2} />
                <path d={linePath(om)} fill="none" stroke="#b45309" strokeWidth={2} />
                <path d={linePath(ahorro)} fill="none" stroke="#15803d" strokeWidth={2} />
            </svg>
            <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-sm bg-blue-700" /> Equipamiento
                </span>
                <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-sm bg-amber-700" /> O&amp;M
                </span>
                <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-sm bg-green-700" /> Ahorro
                </span>
            </div>
        </div>
    );
}

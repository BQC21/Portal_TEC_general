"use client";

import { useConverterSunat } from "@/features/ViewModel/hooks/api/useConverterSunat";
import { QuoteReportTable_Props } from "@/lib/types/components/sub_components/module_render";
import { CurrencyCode } from "@/lib/types/components/General/options";
import { FALLBACK_EXCHANGE_RATE } from "@/lib/utils/consts/price_manage";
import { convertUsdToPen } from "@/lib/utils/helpers/computes/price_manage";
import { computeReportSubtotal } from "@/lib/utils/helpers/computes/report_computes";
import { formatCurrency } from "@/lib/utils/normalization";
import { PRICE_CURRENCY_OPTIONS } from "@/lib/utils/options";
import { useState } from "react";

export function QuoteReportTable({
    precioFinal, igv, opcion_dscto, formato_dscto, tasa_dscto,
}: QuoteReportTable_Props){
    const [currency, setCurrency] = useState<CurrencyCode>("USD");
    const { sellPrice, buyPrice, date, loading, error } = useConverterSunat();
    const exchangeRate =
        sellPrice > 0 ? sellPrice : buyPrice > 0 ? buyPrice : FALLBACK_EXCHANGE_RATE;
    const igvFactor = igv > 1 ? igv / 100 : igv;
    const { subtotalSinDscto, precioDscto, subtotal } = computeReportSubtotal(
        precioFinal,
        opcion_dscto,
        formato_dscto,
        tasa_dscto,
    );
    const hasDiscount = precioDscto > 0;
    const currencyMark = currency === "PEN" ? "S/" : "$";

    function money(amountUsd: number) {
        const amount = currency === "PEN" ? convertUsdToPen(amountUsd, exchangeRate) : amountUsd;
        return formatCurrency(amount, currency);
    }

    const discountLabel = formato_dscto === "USD"
        ? `Descuento (${money(precioDscto)})`
        : `Descuento (${Number(tasa_dscto) || 0}%)`;
    const rateLabel = loading
        ? "Cargando tipo de cambio..."
        : error
            ? `Tipo de cambio no disponible (usando ${FALLBACK_EXCHANGE_RATE})`
            : `Tipo de cambio SUNAT${date ? ` (${date})` : ""}: ${exchangeRate.toFixed(3)}`;

    return(
        <>
            <section className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-2xl font-bold text-slate-900">Resumen de costos de cotización</h2>
                    <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                        Tipo de moneda
                        <select
                            className="h-10 rounded-xl border border-slate-300 bg-sky-50 px-3 text-slate-900"
                            value={currency}
                            onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
                            aria-label="Tipo de moneda"
                        >
                            {PRICE_CURRENCY_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
                {currency === "PEN" ? (
                    <p className="text-sm text-slate-500">{rateLabel}</p>
                ) : null}
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="min-w-full border-separate border-spacing-0">
                        <thead className="sticky top-0 z-10 bg-slate-100">
                            <tr className="bg-slate-400 text-white text-left">
                                <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                    Descripción
                                </th>
                                <th className="border-b border-slate-200 px-4 py-4 text-[1.02rem] font-bold text-slate-900">
                                    Costo
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {hasDiscount ? (
                                <>
                                    <tr className="bg-slate-200 text-left">
                                        <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                            Subtotal sin descuento ({currencyMark})
                                        </td>
                                        <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                            {money(subtotalSinDscto)}
                                        </td>
                                    </tr>
                                    <tr className="bg-slate-200 text-left">
                                        <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                            {discountLabel}
                                        </td>
                                        <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                            {money(precioDscto)}
                                        </td>
                                    </tr>
                                </>
                            ) : null}
                            <tr className="bg-slate-200 text-left">
                                <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                    Subtotal ({currencyMark})
                                </td>
                                <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                    {money(subtotal)}
                                </td>
                            </tr>
                            <tr className="bg-slate-200 text-left">
                                <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                    IGV ({currencyMark})
                                </td>
                                <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                    {money(subtotal * igvFactor)}
                                </td>
                            </tr>
                            <tr className="bg-slate-200 text-left">
                                <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                    Total ({currencyMark})
                                </td>
                                <td className="border-b border-slate-300 bg-slate-50 px-4 py-5 font-semibold text-slate-900">
                                    {money(subtotal * (1 + igvFactor))}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    )
}

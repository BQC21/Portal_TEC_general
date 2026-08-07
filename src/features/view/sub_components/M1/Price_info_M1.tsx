import { Price_info_M1_props } from "@/lib/types/components/sub_components/module_render";
import { AddProductSectionTitle } from "../../components/Form_fields/AddSectionTitle";
import { AddProductNumberField } from "../../components/Form_fields/AddNumberField";
import { AddProductSelectField } from "../../components/Form_fields/AddSelectField";
import { AddProductRadioField } from "../../components/Form_fields/AddRadioField";
import { CurrencyCode, PRICE_CURRENCY_OPTIONS } from "@/lib/utils/options";
import { AddProductReadonlyField } from "../../components/Form_fields/AddReadonlyField";
import { computePricesWithIgv, convertPenToUsd, convertUsdToPen, formatReadonlyCurrency } from "@/lib/utils/helpers/computes/price_manage";
import { useConverterSunat } from "../../hooks/api/useConverterSunat";
import { useEffect, useMemo } from "react";

const FALLBACK_EXCHANGE_RATE = 3.412;
function roundMoney(value: number) {
    return Number((Number.isFinite(value) ? value : 0).toFixed(2));
}

export function Price_info_M1({
    form,
    updateField,
}: Price_info_M1_props){

    const { sellPrice, buyPrice, date, loading, error } = useConverterSunat();
    const exchangeRate =
        sellPrice > 0 ? sellPrice : buyPrice > 0 ? buyPrice : FALLBACK_EXCHANGE_RATE;
    const currency: CurrencyCode =
        form.priceInputCurrency === "PEN" || form.priceInputCurrency === "USD"
            ? form.priceInputCurrency
            : "USD";
    const computedPrices = useMemo(() => {
        const basePen =
            currency === "PEN"
                ? form.precio_soles
                : convertUsdToPen(form.precio_dolares, exchangeRate);
        const baseUsd =
            currency === "USD"
                ? form.precio_dolares
                : convertPenToUsd(form.precio_soles, exchangeRate);
        return computePricesWithIgv(
            Number.isFinite(basePen) ? basePen : 0,
            Number.isFinite(baseUsd) ? baseUsd : 0,
            form.igv,
        );
    }, [currency, exchangeRate, form.igv, form.precio_dolares, form.precio_soles]);
    // Default de moneda si el form aún no tiene priceInputCurrency
    useEffect(() => {
        if (form.priceInputCurrency !== "PEN" && form.priceInputCurrency !== "USD") {
            updateField("priceInputCurrency", "USD");
        }
        // Solo al montar / cuando llega vacío; no depender de updateField (inline en modales)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.priceInputCurrency]);
    // Mantener IGV y moneda convertida alineados con el cálculo actual
    useEffect(() => {
        const nextPen = roundMoney(computedPrices.pricePen);
        const nextUsd = roundMoney(computedPrices.priceUsd);
        const nextPenIgv = roundMoney(computedPrices.totalPen);
        const nextUsdIgv = roundMoney(computedPrices.totalUsd);
        if (currency === "USD" && form.precio_soles !== nextPen) {
            updateField("precio_soles", nextPen);
        }
        if (currency === "PEN" && form.precio_dolares !== nextUsd) {
            updateField("precio_dolares", nextUsd);
        }
        if (form.precio_soles_igv !== nextPenIgv) {
            updateField("precio_soles_igv", nextPenIgv);
        }
        if (form.precio_dolares_igv !== nextUsdIgv) {
            updateField("precio_dolares_igv", nextUsdIgv);
        }
        // updateField es inline en los modales; omitirlo evita bucles
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        computedPrices.pricePen,
        computedPrices.priceUsd,
        computedPrices.totalPen,
        computedPrices.totalUsd,
        currency,
        form.precio_dolares,
        form.precio_dolares_igv,
        form.precio_soles,
        form.precio_soles_igv,
    ]);
    function syncPrices(next: {
        currency: CurrencyCode;
        precio_soles: number;
        precio_dolares: number;
        igv: number;
    }) {
        const prices = computePricesWithIgv(
            next.precio_soles,
            next.precio_dolares,
            next.igv,
        );
        updateField("priceInputCurrency", next.currency);
        updateField("precio_soles", roundMoney(prices.pricePen));
        updateField("precio_dolares", roundMoney(prices.priceUsd));
        updateField("igv", next.igv);
        updateField("precio_soles_igv", roundMoney(prices.totalPen));
        updateField("precio_dolares_igv", roundMoney(prices.totalUsd));
    }
    function handleCurrencyModeChange(nextCurrency: CurrencyCode) {
        if (nextCurrency === "PEN") {
            const pen =
                currency === "USD"
                    ? convertUsdToPen(form.precio_dolares, exchangeRate)
                    : form.precio_soles;
            syncPrices({
                currency: "PEN",
                precio_soles: pen,
                precio_dolares: convertPenToUsd(pen, exchangeRate),
                igv: form.igv,
            });
            return;
        }
        const usd =
            currency === "PEN"
                ? convertPenToUsd(form.precio_soles, exchangeRate)
                : form.precio_dolares;
        syncPrices({
            currency: "USD",
            precio_soles: convertUsdToPen(usd, exchangeRate),
            precio_dolares: usd,
            igv: form.igv,
        });
    }
    function handleUsdChange(value: number) {
        syncPrices({
            currency: "USD",
            precio_soles: convertUsdToPen(value, exchangeRate),
            precio_dolares: value,
            igv: form.igv,
        });
    }
    function handlePenChange(value: number) {
        syncPrices({
            currency: "PEN",
            precio_soles: value,
            precio_dolares: convertPenToUsd(value, exchangeRate),
            igv: form.igv,
        });
    }
    function handleIgvChange(value: number) {
        const basePen =
            currency === "PEN"
                ? form.precio_soles
                : convertUsdToPen(form.precio_dolares, exchangeRate);
        const baseUsd =
            currency === "USD"
                ? form.precio_dolares
                : convertPenToUsd(form.precio_soles, exchangeRate);
        syncPrices({
            currency,
            precio_soles: basePen,
            precio_dolares: baseUsd,
            igv: value,
        });
    }

    const rateLabel = loading
        ? "Cargando tipo de cambio..."
        : error
            ? `Tipo de cambio no disponible (usando ${FALLBACK_EXCHANGE_RATE})`
            : `Tipo de cambio SUNAT${date ? ` (${date})` : ""}: ${exchangeRate.toFixed(3)}`;

    return(
        <>
            {/* Precios */}
            <section className="space-y-5">
                <AddProductSectionTitle title="Información de Precios" />
                <div className="space-y-5">
                    <AddProductSelectField
                        label="Moneda de ingreso"
                        value={currency}
                        options={[...PRICE_CURRENCY_OPTIONS]}
                        onChange={(value) => handleCurrencyModeChange(value as CurrencyCode)}
                    />
                    <p className="text-sm text-slate-500">{rateLabel}</p>
                    <div className="space-y-3">
                        <p className="text-sm font-semibold text-slate-800">Ingresar precio en:</p>
                        <div className="flex flex-wrap gap-6">
                            <AddProductRadioField
                                label="Soles (S/.)"
                                checked={currency === "PEN"}
                                onChange={() => handleCurrencyModeChange("PEN")}
                            />
                            <AddProductRadioField
                                label="Dólares ($)"
                                checked={currency === "USD"}
                                onChange={() => handleCurrencyModeChange("USD")}
                            />
                        </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    <AddProductNumberField
                        label="Precio ($)"
                        min={0} step={0.01}
                        disabled={currency !== "USD"}
                        value={
                            currency === "USD"
                                ? form.precio_dolares > 0
                                    ? form.precio_dolares
                                    : ""
                                : computedPrices.priceUsd > 0
                                    ? roundMoney(computedPrices.priceUsd)
                                    : ""
                        }
                        onChange={handleUsdChange}
                    />
                    <AddProductNumberField
                        label="Precio (S/.)"
                        min={0} step={0.01}
                        disabled={currency !== "PEN"}
                        value={
                            currency === "PEN"
                                ? form.precio_soles > 0
                                    ? form.precio_soles
                                    : ""
                                : computedPrices.pricePen > 0
                                    ? roundMoney(computedPrices.pricePen)
                                    : ""
                        }
                        onChange={handlePenChange}
                    /> 
                    <AddProductNumberField
                        label="IGV (%)"
                        required
                        step={1}
                        min={0}
                        value={form.igv}
                        onChange={handleIgvChange}
                    />
                    <div />
                        <AddProductReadonlyField
                            label="Precio ($) + IGV"
                            value={formatReadonlyCurrency("$", computedPrices.totalUsd)}
                        />
                        <AddProductReadonlyField
                            label="Precio (S/.) + IGV"
                            value={formatReadonlyCurrency("S/.", computedPrices.totalPen)}
                        />
                    </div>
                </div>
            </section>
        </>
    )
}
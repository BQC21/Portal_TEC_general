import { Price_info_M1_props } from "@/lib/types/components/module_render";
import { AddProductSectionTitle } from "../../components/Form_fields/AddSectionTitle";
import { AddProductNumberField } from "../../components/Form_fields/AddNumberField";

export function Price_info_M1({
    form,
    updateField,
}: Price_info_M1_props){
    return(
        <>
            {/* Precios */}
            <section className="space-y-5">
                <AddProductSectionTitle title="Información de Precios" />
                <div className="space-y-5">
                    {/* <AddProductSelectField
                        label="Fuente de tasa de cambio"
                        value={form.priceInputCurrency}
                        options={[...PRICE_CURRENCY_OPTIONS]}
                        onChange={(value) => updateField("priceInputCurrency", value as CurrencyCode)}
                    />
                    <div className="space-y-3">
                    <p className="text-sm font-semibold text-slate-800">Ingresar precio en:</p>
                    <div className="flex flex-wrap gap-6">
                        <AddProductRadioField
                            label="Soles (S/.)"
                            checked={form.priceInputCurrency === "PEN"}
                            onChange={() => handleCurrencyModeChange("PEN")}
                        />
                        <AddProductRadioField
                            label="Dólares ($)"
                            checked={form.priceInputCurrency === "USD"}
                            onChange={() => handleCurrencyModeChange("USD")}
                        />
                    </div>
                </div> */}

                <div className="grid gap-5 md:grid-cols-2">
                    <AddProductNumberField
                        label="Precio ($)"
                        // required
                        step={0.01}
                        min={0.00}
                        // disabled={form.priceInputCurrency !== "USD"}
                        value={form.precio_dolares > 0 ? form.precio_dolares : ""}
                        onChange={(value) => updateField("precio_dolares", value)}
                    />
                    <AddProductNumberField
                        label="Precio (S/.)"
                        // required
                        step={0.01}
                        min={0.00}
                        // disabled={form.priceInputCurrency !== "PEN"}
                        value={form.precio_soles > 0 ? form.precio_soles : ""}
                        onChange={(value) => updateField("precio_soles", value)}
                    /> 
                    <AddProductNumberField
                        label="IGV (%)"
                        required
                        step={1}
                        min={0}
                        value={form.igv}
                        onChange={(value) => updateField("igv", value)}
                    />
                    <div />
                        {/* <AddProductReadonlyField
                            label="Precio + IGV ($)"
                            value={formatReadonlyCurrency("$", computedPrices.totalUsd)}
                        /> */}
                        <AddProductNumberField
                            label="Precio ($) + IGV"
                            // required
                            step={0.01}
                            min={0.00}
                            // disabled={form.priceInputCurrency !== "PEN"}
                            value={form.precio_dolares_igv > 0 ? form.precio_dolares_igv : ""}
                            onChange={(value) => updateField("precio_dolares_igv", value)}
                        /> 
                        {/* <AddProductReadonlyField
                            label="Precio + IGV (S/.)"
                            value={3.412*formatReadonlyCurrency("S/.", computedPrices.totalPen)}
                        /> */}
                        <AddProductNumberField
                            label="Precio (S/.) + IGV"
                            // required
                            step={0.01}
                            min={0.00}
                            // disabled={form.priceInputCurrency !== "PEN"}
                            value={form.precio_soles_igv > 0 ? form.precio_soles_igv : ""}
                            onChange={(value) => updateField("precio_soles_igv", value)}
                        /> 
                    </div>
                </div>
            </section>
        </>
    )
}
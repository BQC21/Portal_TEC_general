import { Quote, QuoteFormState } from "@/lib/types/supabase/quote-types";
import { INITIAL_QUOTE_FORM } from "@/lib/utils/initialValues";
import { SetStateAction } from "react";

type FormWithQuoteSelection = {
    cotizacion_id?: string;
    cotizacion_info?: Quote | undefined;
    precio_cotizacion?: string;
};

export function QuoteSelection<T extends FormWithQuoteSelection>(
    value: string,
    quotes: Quote[],
    setForm_quote: (value: SetStateAction<QuoteFormState>) => void,
    setForm: (value: SetStateAction<T>) => void
){
    if (value === "Seleccione cotización") {
        setForm_quote(INITIAL_QUOTE_FORM);
        setForm((current) => ({
            ...current,
            cotizacion_id: "",
            cotizacion_info: undefined,
            precio_cotizacion: "",
        }));
        return;
    }

    // búsqueda de la cotización seleccionada
    const selected = quotes.find(
        (quote) =>
            `(${quote.cod_cotizacion}) - ${quote.proyecto_info?.nombre ?? ""}` === value
    );

    if (selected){
        setForm_quote({
            ...INITIAL_QUOTE_FORM,
            ...selected,
        })
        const precioUsd = Number(selected.precio_dolares);
        setForm((current) => ({
            ...current,
            cotizacion_id: selected.id,
            cotizacion_info: selected,
            precio_cotizacion: Number.isFinite(precioUsd)
                ? precioUsd.toFixed(2)
                : "",
        }));
    }
}

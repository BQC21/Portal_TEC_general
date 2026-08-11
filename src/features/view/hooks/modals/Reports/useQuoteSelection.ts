import { Quote, QuoteFormState } from "@/lib/types/supabase/quote-types";
import { INITIAL_QUOTE_FORM } from "@/lib/utils/initialValues";
import { SetStateAction } from "react";

type FormWithQuoteSelection = {
    cotizacion_id?: string;
    cotizacion_info?: Quote | undefined;
};

export function QuoteSelection<T extends FormWithQuoteSelection>(
    value: string,
    quotes: Quote[],
    setForm_quote: (value: SetStateAction<QuoteFormState>) => void,
    setForm: (value: SetStateAction<T>) => void
){
    // actualizador
    function updateField<K extends keyof FormWithQuoteSelection>(field: K, value: FormWithQuoteSelection[K]){
        setForm((current) => {
            const update = {... current, [field]: value};
            return update;
        })
    }

    // condiciones nulas
    if (value === "Seleccione cotización") {
        setForm_quote(INITIAL_QUOTE_FORM);
        updateField("cotizacion_id", "");
        updateField("cotizacion_info", undefined);
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
        updateField("cotizacion_id", selected.id);
        updateField("cotizacion_info", selected);
    }
}

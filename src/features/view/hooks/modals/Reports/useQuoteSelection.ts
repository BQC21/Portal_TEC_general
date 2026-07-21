import { Quote, QuoteFormState } from "@/lib/types/supabase/quote-types";
import { ReportFormState } from "@/lib/types/supabase/report-types";
import { INITIAL_QUOTE_FORM } from "@/lib/utils/initialValues";
import { SetStateAction } from "react";

export function QuoteSelection(
    value: string, 
    quotes: Quote[], 
    setForm_quote: (value: SetStateAction<QuoteFormState>) => void, 
    setForm: (value: SetStateAction<ReportFormState>) => void
){
    // actualizador
    function updateField<K extends keyof ReportFormState>(field: K, value: ReportFormState[K]){
        setForm((current) => {
            const update = {... current, [field]: value};
            return update;
        })
    }

    // condiciones nulas
    if (value === "Selecciona cotización") {
        setForm_quote(INITIAL_QUOTE_FORM);
        updateField("cotizacion_id", "");
        updateField("cotizacion_info", undefined);
    }

    // búsqueda de la cotización seleccionada
    const selected = quotes.find((quote) => quote.cod_cotizacion === value)

    if (selected){
        setForm_quote({
            ...INITIAL_QUOTE_FORM,
            ...selected,
        })
        updateField("cotizacion_id", selected.id);
        updateField("cotizacion_info", selected);
    }
}
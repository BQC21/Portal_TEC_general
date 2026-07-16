import { EMPTY_PERSONAL_ITEM, EMPTY_QUANTITY_PRICE_ITEM, ManualCosts, PersonalItem } from "@/lib/types/components/Quotes/manual_resources";
import { SetStateAction } from "react";

type QuantityPriceSection =
        | "Recursos.epp"
        | "Recursos.tooling"
        | "Recursos.sctr"
        | "Viaticos.courier"
        | "Recursos.personal";

type NoPersonalQutantityPriceSection = Omit<QuantityPriceSection, "Recursos.personal">;

export function ManageLocalCosts(
    setManualResourceCosts: (value: SetStateAction<ManualCosts>) => void)
{

    // Editar un campo de una fila específica
    function updateManualCostItem(
        section: NoPersonalQutantityPriceSection,
        index: number,
        field: keyof NoPersonalQutantityPriceSection,
        value: NoPersonalQutantityPriceSection[keyof NoPersonalQutantityPriceSection],
    ) {
        setManualResourceCosts((current) => {
            if (section.startsWith("Recursos.")) {
                const subcategory = section.replace("Recursos.", "") as "epp" | "tooling" | "sctr";

                return {
                    ...current,
                    Recursos: {
                        ...current.Recursos,
                        [subcategory]: current.Recursos[subcategory].map((item, i) =>
                            i === index
                                ? { ...item, [field]: value }
                                : item
                        ),
                    },
                };
            }

            return {
                ...current,
                Viaticos: {
                    ...current.Viaticos,
                    courier: current.Viaticos.courier.map((item, i) =>
                        i === index
                            ? { ...item, [field]: value }
                            : item
                    ),
                },
            };
        });
    }

    function updateManualCostItem_personal(
        index: number,
        field: keyof PersonalItem,
        value: PersonalItem[keyof PersonalItem],
    ) {
        setManualResourceCosts((current) => ({
            ...current,
            Recursos: {
                ...current.Recursos,
                personal: current.Recursos.personal.map((item, i) =>
                    i === index
                        ? { ...item, [field]: value }
                        : item
                ),
            },
        }));
    }

    // Agregar fila vacía
    function addManualCostItem(section: QuantityPriceSection) {
        setManualResourceCosts((current) => {
            if (section === "Recursos.personal") {
                return {
                    ...current,
                    Recursos: {
                        ...current.Recursos,
                        personal: [
                            ...current.Recursos.personal,
                            { id: crypto.randomUUID(), ...EMPTY_PERSONAL_ITEM },
                        ],
                    },
                };
            }
            if (section.startsWith("Recursos.")) {
                const subcategory = section.replace("Recursos.", "") as "epp" | "tooling" | "sctr";
                return {
                    ...current,
                    Recursos: {
                        ...current.Recursos,
                        [subcategory]: [
                            ...current.Recursos[subcategory],
                            { id: crypto.randomUUID(), ...EMPTY_QUANTITY_PRICE_ITEM },
                        ],
                    },
                };
            }
            return {
                ...current,
                Viaticos: {
                    ...current.Viaticos,
                    courier: [
                        ...current.Viaticos.courier,
                        { id: crypto.randomUUID(), ...EMPTY_QUANTITY_PRICE_ITEM },
                    ],
                },
            };
        });
    }

    // Eliminar fila por índice (mantiene al menos una fila)
    function removeManualCostItem(section: QuantityPriceSection, index: number) {
        setManualResourceCosts((current) => {
            if (section === "Recursos.personal") {
                if (current.Recursos.personal.length <= 1) return current;
                return {
                    ...current,
                    Recursos: {
                        ...current.Recursos,
                        personal: current.Recursos.personal.filter((_, i) => i !== index),
                    },
                };
            }
            if (section.startsWith("Recursos.")) {
                const subcategory = section.replace("Recursos.", "") as "epp" | "tooling" | "sctr";
                return {
                    ...current,
                    Recursos: {
                        ...current.Recursos,
                        [subcategory]: current.Recursos[subcategory].filter((_, i) => i !== index),
                    },
                };
            }
            return {
                ...current,
                Viaticos: {
                    ...current.Viaticos,
                    courier: current.Viaticos.courier.filter((_, i) => i !== index),
                },
            };
        });
    }

    return{
        updateManualCostItem,
        updateManualCostItem_personal,
        addManualCostItem,
        removeManualCostItem
    }
}
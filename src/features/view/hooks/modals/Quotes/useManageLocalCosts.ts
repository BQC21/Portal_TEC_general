import {
    EMPTY_PERSONAL_ITEM,
    EMPTY_QUANTITY_PRICE_ITEM,
    ManualCosts,
    MontoItem,
    PersonalItem,
    QuantityPriceItem,
} from "@/lib/types/components/Quotes/manual_resources";
import { SetStateAction } from "react";

type ManualCostArraySection =
    | "Recursos.epp"
    | "Recursos.tooling"
    | "Recursos.sctr"
    | "Recursos.personal"
    | "Viaticos.courier";

type ManualCostMontoSection =
    | "Recursos.hotel"
    | "Viaticos.eating"
    | "Viaticos.traveling";

type QuantityPriceSection = ManualCostArraySection | ManualCostMontoSection;

export function ManageLocalCosts(
    setManualResourceCosts: (value: SetStateAction<ManualCosts>) => void,
) {
    // Editar un campo de una fila en secciones con arrays
    function updateManualCostItem(
        section: ManualCostArraySection,
        index: number,
        field: keyof QuantityPriceItem | keyof PersonalItem,
        value: QuantityPriceItem[keyof QuantityPriceItem] | PersonalItem[keyof PersonalItem],
    ) {
        setManualResourceCosts((current) => {
            if (section === "Recursos.personal") {
                return {
                    ...current,
                    Recursos: {
                        ...current.Recursos,
                        personal: current.Recursos.personal.map((item, i) =>
                            i === index ? { ...item, [field]: value } : item,
                        ),
                    },
                };
            }

            if (section.startsWith("Recursos.")) {
                const subcategory = section.replace("Recursos.", "") as "epp" | "tooling" | "sctr";

                return {
                    ...current,
                    Recursos: {
                        ...current.Recursos,
                        [subcategory]: current.Recursos[subcategory].map((item, i) =>
                            i === index ? { ...item, [field]: value } : item,
                        ),
                    },
                };
            }

            return {
                ...current,
                Viaticos: {
                    ...current.Viaticos,
                    courier: current.Viaticos.courier.map((item, i) =>
                        i === index ? { ...item, [field]: value } : item,
                    ),
                },
            };
        });
    }

    // Editar un campo en secciones de monto único (hotel, alimentación, viajes)
    function updateManualCostMonto(
        section: ManualCostMontoSection,
        field: keyof MontoItem,
        value: MontoItem[keyof MontoItem],
    ) {
        setManualResourceCosts((current) => {
            if (section === "Recursos.hotel") {
                return {
                    ...current,
                    Recursos: {
                        ...current.Recursos,
                        hotel: { ...current.Recursos.hotel, [field]: value },
                    },
                };
            }

            if (section === "Viaticos.eating") {
                return {
                    ...current,
                    Viaticos: {
                        ...current.Viaticos,
                        eating: { ...current.Viaticos.eating, [field]: value },
                    },
                };
            }

            return {
                ...current,
                Viaticos: {
                    ...current.Viaticos,
                    traveling: { ...current.Viaticos.traveling, [field]: value },
                },
            };
        });
    }

    // Agregar fila vacía (solo secciones con arrays)
    function addManualCostItem(section: ManualCostArraySection) {
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
    function removeManualCostItem(section: ManualCostArraySection, index: number) {
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
                if (current.Recursos[subcategory].length <= 1) return current;

                return {
                    ...current,
                    Recursos: {
                        ...current.Recursos,
                        [subcategory]: current.Recursos[subcategory].filter((_, i) => i !== index),
                    },
                };
            }

            if (current.Viaticos.courier.length <= 1) return current;

            return {
                ...current,
                Viaticos: {
                    ...current.Viaticos,
                    courier: current.Viaticos.courier.filter((_, i) => i !== index),
                },
            };
        });
    }

    return {
        updateManualCostItem,
        updateManualCostMonto,
        addManualCostItem,
        removeManualCostItem,
    };
}

export type { ManualCostArraySection, ManualCostMontoSection, QuantityPriceSection };

import { DateSortField, DateSortOrder, ProductSortingOrder } from "../General/options";

export type ProductSortingProps = {
    value: ProductSortingOrder;
    onSortingChange: (value: ProductSortingOrder) => void;
};

export type DateSortingProps = {
    field: DateSortField;
    value: DateSortOrder;
    onSortingChange: (value: DateSortOrder) => void;
};
import { ProductSortingOrder } from "../General/options";

export type ProductSortingProps = {
    value: ProductSortingOrder;
    onSortingChange: (value: ProductSortingOrder) => void;
};
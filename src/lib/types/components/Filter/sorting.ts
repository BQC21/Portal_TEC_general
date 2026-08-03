import { ProductSortingOrder } from "@/lib/utils/options";

export type ProductSortingProps = {
    value: ProductSortingOrder;
    onSortingChange: (value: ProductSortingOrder) => void;
};
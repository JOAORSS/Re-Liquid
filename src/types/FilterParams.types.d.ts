export type SortOption = "popular" | "new" | "price-asc" | "price-desc" | "rating";

export default interface FilterParams {
    stones: string[];
    types: string[];
    collections: string[];
    priceMin: number | null;
    priceMax: number | null;
    sort?: SortOption;
}
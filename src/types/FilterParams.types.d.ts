export type SortOption = "popularity" | "new" | "price-asc" | "price-desc" | "rating" | "A-Z" | "Z-A";

export default interface FilterParams {
    stones: string[];
    types: string[];
    collections: string[];
    priceMin: number | null;
    priceMax: number | null;
    sort?: SortOption;
}
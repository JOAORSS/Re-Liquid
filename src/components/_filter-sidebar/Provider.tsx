import { createContext, useContext } from "react";
import type { TBasicProduct } from "../../types/store.types";
import { useFilterParams } from "../../util/useFilterParams";
import type FilterParams from "../../types/FilterParams.types";
import { injectLiquid } from "../../util/shopify";

interface FilterContextValue {
    allProducts: TBasicProduct[];
    filteredProducts: TBasicProduct[];
    filters: FilterParams;
    toggleStone: (s: string) => void;
    toggleType: (t: string) => void;
    toggleCollection: (c: string) => void;
    updateFilters: (f: Partial<FilterParams>) => void;
    clearAll: () => void;
}

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ products, children }: { products: TBasicProduct[], children: React.ReactNode }) {
    const { filters, toggleStone, toggleType, toggleCollection, updateFilters, clearAll } = useFilterParams();

    const showOutOfStock = injectLiquid<boolean>(`section.settings.show_out_of_stock | json`);

    const filteredProducts = products
        .filter(p => filters.stones.length === 0 || filters.stones.some(s => p.tags.some(t => t.toLowerCase() === s)))
        .filter(p => filters.types.length === 0 || filters.types.some(t => p.tags.some(tag => tag.toLowerCase() === t)))
        .filter(p => filters.collections.length === 0 || filters.collections.every(c => p.collections?.includes(c)))
        .filter(p => filters.priceMin == null || Number(p.price) >= filters.priceMin)
        .filter(p => filters.priceMax == null || Number(p.price) <= filters.priceMax)
        .filter(p => showOutOfStock || p.quantity > 0);

    console.log(showOutOfStock);

    const sorted = [...filteredProducts].sort((a, b) => {
        switch (filters.sort) {
            case "price-asc":  return Number(a.price) - Number(b.price);
            case "price-desc": return Number(b.price) - Number(a.price);
            case "new":        return b.id - a.id;
            default:           return 0;
        }
    });

    return (
        <FilterContext.Provider value={{ 
            allProducts: products,
            filteredProducts: sorted,
            filters, 
            toggleStone, 
            toggleType,
            toggleCollection, 
            updateFilters, 
            clearAll 
        }}>
            {children}
        </FilterContext.Provider>
    );
}

export const useFilter = () => useContext(FilterContext)!;
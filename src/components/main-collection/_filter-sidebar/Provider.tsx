import { createContext, useContext, useMemo } from "react";
import type { TBasicProduct } from "../../../types/store.types";
import { useFilterParams } from "../../../util/useFilterParams";
import type FilterParams from "../../../types/FilterParams.types";
import { calculateProductRating, injectLiquid, normalizeTag } from "../../../util/shopify";

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

    const showOutOfStock = injectLiquid<boolean>(`settings.show_out_of_stock | json`);

    console.log("showOutOfStock", showOutOfStock);

    const processedProducts = useMemo(() => {
        const filtered = products.filter(p => {
            const matchesStone = filters.stones.length === 0 || p.stone?.some(s => filters.stones.some(fs => fs.toLowerCase() === s.toLowerCase()));
            const matchesType = filters.types.length === 0 || p.tags.some(t => filters.types.includes(normalizeTag(t)));
            const matchesCollection = filters.collections.length === 0 || filters.collections.every(c => p.collections?.includes(c));
            const matchesPriceMin = filters.priceMin == null || Number(p.price) >= filters.priceMin;
            const matchesPriceMax = filters.priceMax == null || Number(p.price) <= filters.priceMax;
            const matchesStock = showOutOfStock || p.quantity > 0;

            return matchesStone && matchesType && matchesCollection && matchesPriceMin && matchesPriceMax && matchesStock;
        });

        return filtered.sort((a, b) => {
            switch (filters.sort) {
                case "price-asc":  
                    return Number(a.price) - Number(b.price);
                case "price-desc": 
                    return Number(b.price) - Number(a.price);
                case "new":        
                    return b.id - a.id;
                case "A-Z":  
                    return a.title.localeCompare(b.title);
                case "Z-A": 
                    return b.title.localeCompare(a.title);
                case "rating":     
                    return calculateProductRating(b.id).rating - calculateProductRating(a.id).rating;
                case "popularity": 
                    return calculateProductRating(b.id).reviewCount - calculateProductRating(a.id).reviewCount;
                default:           
                    return 0;
            }
        });
    }, [products, filters, showOutOfStock]);

    return (
        <FilterContext.Provider value={{ 
            allProducts: products,
            filteredProducts: processedProducts,
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
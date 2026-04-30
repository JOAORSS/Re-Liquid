import { useState, useCallback, useEffect } from "react";
import type FilterParams from "../types/FilterParams.types";

function readFromURL(): FilterParams {
    const params = new URLSearchParams(window.location.search);
    return {
        stones:      params.getAll("stone"),
        types:       params.getAll("type"),
        collections: params.getAll("collection"),
        priceMin:    params.has("min") ? Number(params.get("min")) : null,
        priceMax:    params.has("max") ? Number(params.get("max")) : null,
    };
}

function writeToURL(filters: FilterParams) {
    const params = new URLSearchParams();
    filters.stones.forEach(s => params.append("stone", s));
    filters.types.forEach(t => params.append("type", t));
    filters.collections.forEach(c => params.append("collection", c));
    if (filters.priceMin != null) params.set("min", String(filters.priceMin));
    if (filters.priceMax != null) params.set("max", String(filters.priceMax));
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
}

export function useFilterParams() {
    const [filters, setFilters] = useState<FilterParams>(readFromURL);

    useEffect(() => {
        const onPop = () => setFilters(readFromURL());
        window.addEventListener("popstate", onPop);
        return () => window.removeEventListener("popstate", onPop);
    }, []);

    const updateFilters = useCallback((next: Partial<FilterParams>) => {
        setFilters(prev => {
            const merged = { ...prev, ...next };
            writeToURL(merged);
            return merged;
        });
    }, []);

    const toggleStone = useCallback((stone: string) => {
        setFilters(prev => {
            const exists = prev.stones.includes(stone);
            const stones = exists
                ? prev.stones.filter(s => s !== stone)
                : [...prev.stones, stone];
            const next = { ...prev, stones };
            writeToURL(next);
            return next;
        });
    }, []);

    const toggleType = useCallback((type: string) => {
        setFilters(prev => {
            const exists = prev.types.includes(type);
            const types = exists
                ? prev.types.filter(t => t !== type)
                : [...prev.types, type];
            const next = { ...prev, types };
            writeToURL(next);
            return next;
        });
    }, []);

    const toggleCollection = useCallback((collection: string) => {
        setFilters(prev => {
            const exists = prev.collections.includes(collection);
            const collections = exists
                ? prev.collections.filter(c => c !== collection)
                : [...prev.collections, collection];
            const next = { ...prev, collections };
            writeToURL(next);
            return next;
        });
    }, []);

    const clearAll = useCallback(() => {
        const empty: FilterParams = { stones: [], types: [], collections: [], priceMin: null, priceMax: null };
        writeToURL(empty);
        setFilters(empty);
    }, []);

    return { filters, updateFilters, toggleStone, toggleType, clearAll, toggleCollection };
}
import React, { useState, useMemo, useEffect } from "react";
import { styled } from "@linaria/react";
import { useShopifyData } from "../../util/ShopifyDataContext";
import type { TBasicProduct } from "../../types/store.types";
import type { Settings } from "./main-search.types";
import { Collection } from "../main-collection/main-collection";

export function MainSearch(props: { settings: Settings }) {
    const { searchProducts } = useShopifyData();
    const products: TBasicProduct[] = Array.isArray(searchProducts) ? searchProducts : (searchProducts?.products || []);

    const [query, setQuery] = useState("");

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const q = urlParams.get("q");
        if (q) {
            setQuery(q);
        }
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = new URL(window.location.href);
        url.searchParams.set("q", query);
        window.history.pushState({}, "", url.toString());
    };

    const textFilteredProducts = useMemo(() => {
        if (query.length < 3) return [];

        const searchTerm = query.toLowerCase().trim();
        return products.filter((p) => {
            if (p.title && p.title.toLowerCase().includes(searchTerm)) return true;
            if (p.stone && p.stone.some(s => s.toLowerCase().includes(searchTerm))) return true;
            if (p.tags && p.tags.some(t => t.toLowerCase().includes(searchTerm))) return true;
            if (p.description && p.description.toLowerCase().includes(searchTerm)) return true;
            return false;
        });
    }, [products, query]);

    return (
        <SearchContainer>
            <HeaderArea>
                <SearchForm onSubmit={handleSearchSubmit}>
                    <SearchInput 
                        type="text" 
                        value={query} 
                        onChange={(e) => setQuery(e.target.value)} 
                        placeholder={props.settings.placeholder} 
                    />
                    <SearchButton type="submit">Search</SearchButton>
                </SearchForm>
            </HeaderArea>

            {query.length < 3 ? (
                <EmptyState>
                    <h2>{props.settings.title}</h2>
                </EmptyState>
            ) : (
                textFilteredProducts.length === 0 ? (
                    <EmptyState>
                        <h2>{props.settings.not_found}</h2>
                    </EmptyState>
                ) : (
                <Collection searchProducts={textFilteredProducts} settings={{...props.settings, out_stock_label: ""}} />
                )
            )}
        </SearchContainer>
    );
}

const SearchContainer = styled.div`
    max-width: var(--page-width, 1400px);
    margin: 0 auto;
    padding: 40px 20px;
    min-height: 60vh;
`;

const HeaderArea = styled.div`
    text-align: center;
    margin-bottom: 40px;

    @media (max-width: 768px) {
        margin-bottom: 24px;
    }
`;

const SearchForm = styled.form`
    display: flex;
    max-width: 700px;
    margin: 0 auto;
    border: 1px solid var(--plum, #6b4c7a);
    border-radius: 4px;
    overflow: hidden;
`;

const SearchInput = styled.input`
    flex-grow: 1;
    padding: 16px 20px;
    border: none;
    font-family: var(--font-body);
    font-size: 16px;
    outline: none;
    
    &:focus {
        background-color: var(--plum-light, #f5f0f6);
    }

    @media (max-width: 768px) {
        padding: 12px 16px;
        font-size: 14px;
    }
`;

const SearchButton = styled.button`
    padding: 0 40px;
    background-color: var(--plum, #6b4c7a);
    color: #fff;
    border: none;
    font-family: var(--font-body);
    font-weight: 600;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: var(--dark, #333);
    }

    @media (max-width: 768px) {
        padding: 0 20px;
        font-size: 12px;
        letter-spacing: 0.5px;
    }
`;

const EmptyState = styled.div`
    text-align: center;
    padding: 80px 20px;
    font-family: var(--font-display);
    color: var(--dark);
    
    h2 {
        font-weight: 400;
        font-size: 28px;
        opacity: 0.8;
    }

    @media (max-width: 768px) {
        h2 {
            font-size: 18px;
        }
    }
`;
import { styled } from "@linaria/react";
import { useFilter } from "../_filter-sidebar/Provider";
import type { SortOption } from "../../../types/FilterParams.types";

interface CollectionHeaderProps {
    title: string;
}

export function CollectionHeader({ title }: CollectionHeaderProps) {
    const { filteredProducts, updateFilters, filters } = useFilter();

    const handleSort = (value: SortOption) => {
        updateFilters({ sort: value });
    };
    
    return (
        <Header>
            <div>
                <Title>{title}</Title>
                <Count>{filteredProducts.length} products</Count>
            </div>
            <SortWrap>
                <SortLabel>Sort by:</SortLabel>
                <SortSelect
                    value={filters.sort ?? "popularity"}
                    onChange={e => handleSort(e.target.value as SortOption)}
                >
                    <option value="popularity">Most Popular</option>
                    <option value="new">New Arrivals</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Best Rated</option>
                    <option value="A-Z">A-Z Alphabetical</option>
                    <option value="Z-A">Z-A Alphabetical</option>
                </SortSelect>
            </SortWrap>
        </Header>
    );
}

const Header = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 24px;
`;

const Title = styled.h1`
    font-family: var(--font-display);
    font-size: 28px;
    font-weight: 300;
    color: var(--dark);
    margin-bottom: 4px;
`;

const Count = styled.p`
    font-size: 11px;
    color: var(--grey);
    letter-spacing: 0.5px;
`;

const SortWrap = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;

    @media screen and (max-width: 768px) {
        flex-direction: column;
        align-items: flex-end;
    }
`;

const SortLabel = styled.span`
    font-size: 10px;
    font-family: var(--font-display);
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--grey);
`;

const SortSelect = styled.select`
    padding: 7px 28px 7px 10px;
    border: 1.5px solid var(--border);
    border-radius: 4px;
    font-family: var(--font-body);
    font-size: 11px;
    font-weight: 600;
    color: var(--dark);
    background: #fff;
    cursor: pointer;
    outline: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23888' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    transition: border-color 0.2s;

    &:hover, &:focus {
        border-color: var(--gold);
    }
`;
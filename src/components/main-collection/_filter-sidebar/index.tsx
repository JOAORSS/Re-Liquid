import { useState } from "react";
import { styled } from "@linaria/react";
import { useFilter } from "./Provider";
import { normalizeTag } from "../../../util/shopify";

export default function FilterSidebar() {
    const { filters, toggleStone, toggleType, updateFilters, filteredProducts, allProducts } = useFilter();
    const [priceMin, setPriceMin] = useState(filters.priceMin ?? "");
    const [priceMax, setPriceMax] = useState(filters.priceMax ?? "");
    const [typesExpanded, setTypesExpanded] = useState(false);
    const [stonesExpanded, setStonesExpanded] = useState(false);
    const [isMobileExpanded, setIsMobileExpanded] = useState(false);

    const inStockProducts = allProducts.filter(p => p.quantity >= 1);

    const stoneCounts = inStockProducts.reduce((acc, product) => {
        product.stone?.forEach(stone => {
            acc[stone] = (acc[stone] || 0) + 1;
        });
        return acc;
    }, {} as Record<string, number>);

    const stoneOptions = Object.keys(stoneCounts);
    const MAX_VISIBLE_STONES = 5;
    const visibleStones = stonesExpanded ? stoneOptions : stoneOptions.slice(0, MAX_VISIBLE_STONES);
    const hiddenStonesCount = stoneOptions.length - MAX_VISIBLE_STONES;

    const typeCounts = inStockProducts.reduce((acc, product) => {
        product.tags.forEach(tag => {
            const isStone = product.stone!.some(s => s.toLowerCase() === tag.toLowerCase());
            
            if (!isStone) {
                const normalizedType = normalizeTag(tag);
                acc[normalizedType] = (acc[normalizedType] || 0) + 1;
            }
        });
        return acc;
    }, {} as Record<string, number>);

    const typeOptions = Object.keys(typeCounts);

    const MAX_VISIBLE_TYPES = 7;
    const visibleTypes = typesExpanded ? typeOptions : typeOptions.slice(0, MAX_VISIBLE_TYPES);
    const hiddenTypesCount = typeOptions.length - MAX_VISIBLE_TYPES;

    const applyPrice = () => {
        updateFilters({
            priceMin: priceMin !== "" ? Number(priceMin) : null,
            priceMax: priceMax !== "" ? Number(priceMax) : null,
        });
    };

    return (
        <SidebarContainer>
            <MobileToggle onClick={() => setIsMobileExpanded(!isMobileExpanded)}>
                <span>Filters</span>
                <span>{isMobileExpanded ? "-" : "+"}</span>
            </MobileToggle>

            <FilterContent isExpanded={isMobileExpanded}>
                <Block>
                    <BlockTitle>Crystal</BlockTitle>
                    <BlockList>
                        <StoneButton
                            className={"active"}
                            onClick={() => updateFilters({ stones: [] })}
                        >
                            <StoneAll>✦</StoneAll>
                            <StoneLabel>All Crystals</StoneLabel>
                            <StoneCount>{filteredProducts.length}</StoneCount>
                        </StoneButton>

                        {visibleStones.map((s, i) => (
                            <StoneButton
                                key={i}
                                className={filters.stones.includes(s.toLowerCase()) ? "active" : ""}
                                onClick={() => toggleStone(s.toLowerCase())}
                            >
                                <StoneLabel>{s}</StoneLabel>
                                <StoneCount>{stoneCounts[s]}</StoneCount>
                            </StoneButton>
                        ))}
                    </BlockList>
                    {stoneOptions.length > MAX_VISIBLE_STONES && (
                        <ToggleMoreButton onClick={() => setStonesExpanded(!stonesExpanded)}>
                            {stonesExpanded ? "Show less" : `+ Show ${hiddenStonesCount} more`}
                        </ToggleMoreButton>
                    )}
                </Block>

                <Block>
                    <BlockTitle>Type</BlockTitle>
                    <BlockList> 
                        {visibleTypes.map((type, i) => (
                            <TypeContainer key={i}>
                                <TypeCheckbox
                                    type="checkbox"
                                    checked={filters.types.includes(type)}
                                    onChange={() => toggleType(type)}
                                />
                                <TypeLabel>
                                    {type}
                                    <TypeCount>{typeCounts[type]}</TypeCount>
                                </TypeLabel>
                            </TypeContainer>
                        ))}
                    </BlockList>
                    {typeOptions.length > MAX_VISIBLE_TYPES && (
                        <ToggleMoreButton onClick={() => setTypesExpanded(!typesExpanded)}>
                            {typesExpanded ? "Show less" : `+ Show ${hiddenTypesCount} more`}
                        </ToggleMoreButton>
                    )}
                </Block>

                <Block>
                    <BlockTitle>Price (AUD)</BlockTitle>
                    <PriceContainer>
                        <PriceInput
                            type="number"
                            placeholder="$0"
                            min={0}
                            value={priceMin}
                            onChange={e => setPriceMin(e.target.value)}
                        />
                        <PriceDash>—</PriceDash>
                        <PriceInput
                            type="number"
                            placeholder="$999"
                            min={0}
                            value={priceMax}
                            onChange={e => setPriceMax(e.target.value)}
                        />
                    </PriceContainer>
                    <PriceApply onClick={applyPrice}>Apply</PriceApply>
                </Block>
            </FilterContent>
        </SidebarContainer>
    );
}

const SidebarContainer = styled.aside`
    width: 220px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 28px;
    position: sticky;
    font-family: var(--font-display);
    top: calc(80px + 14px);
    align-self: flex-start;
    max-height: calc(100vh - 80px - 34px);
    overflow-y: auto;

    @media (max-width: 768px) {
        width: 100%;
        position: static;
        max-height: none;
        overflow-y: visible;
        gap: 16px;
    }
`;

const MobileToggle = styled.button`
    display: none;

    @media (max-width: 768px) {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 14px 16px;
        background: var(--plum-light, #f4f0f5);
        border: 1px solid var(--border);
        border-radius: 6px;
        font-family: var(--font-display);
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 1px;
        text-transform: uppercase;
        color: var(--dark);
        cursor: pointer;
    }
`;

const FilterContent = styled.div<{ isExpanded: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 28px;

    @media (max-width: 768px) {
        display: ${props => (props.isExpanded ? "flex" : "none")};
    }
`;

const Block = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const BlockTitle = styled.div`
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--grey);
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border);
`;

const BlockList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-height: 20vh;
    overflow-y: auto;
`;

const StoneButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    border-radius: 6px;
    border: 1.5px solid transparent;
    background: none;
    cursor: pointer;
    transition: all 0.2s;
    font-family: var(--font-body);
    width: 100%;
    text-align: left;

    &:hover {
        background: var(--plum-light);
    }

    &.active {
        border-color: var(--gold);
        background: var(--plum-light);
    }
`;

const StoneAll = styled.span`
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gold);
    font-size: 12px;
    flex-shrink: 0;
`;

const StoneLabel = styled.span`
    font-size: 11px;
    font-weight: 600;
    color: var(--dark);
    flex: 1;
    text-transform: capitalize;
`;

const StoneCount = styled.span`
    font-size: 10px;
    color: var(--grey);
`;

const TypeContainer = styled.label`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 8px;
    cursor: pointer;
    border-radius: 6px;
    transition: background 0.2s;

    &:hover {
        background: var(--plum-light);
    }
`;

const TypeCheckbox = styled.input`
    width: 14px;
    height: 14px;
    accent-color: var(--plum);
    cursor: pointer;
    flex-shrink: 0;
`;

const TypeLabel = styled.span`
    font-size: 11px;
    font-weight: 600;
    color: var(--dark);
    text-transform: capitalize;
    display: flex;
    align-items: center;
    gap: 6px;
`;

const TypeCount = styled.span`
    font-size: 10px;
    color: var(--grey);
    font-weight: 400;
`;

const ToggleMoreButton = styled.button`
    background: none;
    border: none;
    padding: 4px 8px;
    color: var(--grey);
    font-size: 10px;
    font-weight: 600;
    text-align: left;
    text-decoration: underline;
    cursor: pointer;
    font-family: var(--font-body);
    transition: color 0.2s;

    &:hover {
        color: var(--dark);
    }
`;

const PriceContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
`;

const PriceInput = styled.input`
    flex: 1;
    padding: 7px 10px;
    border: 1.5px solid var(--border);
    border-radius: 4px;
    font-family: var(--font-body);
    font-size: 11px;
    color: var(--dark);
    background: #fff;
    outline: none;
    transition: border-color 0.2s;
    min-width: 0;

    &:focus {
        border-color: var(--gold);
    }
`;

const PriceDash = styled.span`
    font-size: 11px;
    color: var(--grey);
    flex-shrink: 0;
`;

const PriceApply = styled.button`
    width: 100%;
    padding: 9px;
    background: var(--plum);
    color: #fff;
    border: none;
    border-radius: 4px;
    font-family: var(--font-body);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s;

    &:hover {
        background: var(--dark);
    }
`;
import { useState } from "react";
import { styled } from "@linaria/react";
import { useFilter } from "./Provider";

interface StoneOption {
    stone: string;
    image: string;
}

export default function FilterSidebar({stoneOptions}: {stoneOptions: StoneOption[]}) {

    const { filters, toggleStone, toggleType, updateFilters, filteredProducts, allProducts } = useFilter();
    const [priceMin, setPriceMin] = useState(filters.priceMin ?? "");
    const [priceMax, setPriceMax] = useState(filters.priceMax ?? "");
    const [typesExpanded, setTypesExpanded] = useState(false);

    const countByStone = (stone: string) =>
        allProducts.filter(p => p.tags.some(t => t.toLowerCase() === stone.toLowerCase()) && p.quantity >= 1).length;

    const countByType = (type: string) =>
        allProducts.filter(p => p.tags.some(t => t.toLowerCase() === type.toLowerCase()) && p.quantity >= 1).length;

    const typeOptions = Array.from(
        new Set(allProducts.filter(p => p.quantity >= 1).flatMap(p => p.tags).map(t => t.toLowerCase()))
    ).filter(tag => !stoneOptions.some(s => s.stone.toLowerCase() === tag));

    const MAX_VISIBLE_TYPES = 10;
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

            <Block>
                <BlockTitle>Crystal</BlockTitle>
                <BlockList>
                    <StoneButton
                        className={filters.stones.length === 0 ? "active" : ""}
                        onClick={() => updateFilters({ stones: [] })}
                    >
                        <StoneAll>✦</StoneAll>
                        <StoneLabel>All Crystals</StoneLabel>
                        <StoneCount>{filteredProducts.length}</StoneCount>
                    </StoneButton>

                    {stoneOptions.map((s, i) => (
                        <StoneButton
                            key={i}
                            className={filters.stones.includes(s.stone.toLowerCase()) ? "active" : ""}
                            onClick={() => toggleStone(s.stone.toLowerCase())}
                        >
                            <StoneImage src={s.image} alt={s.stone} />
                            <StoneLabel>{s.stone}</StoneLabel>
                            <StoneCount>{countByStone(s.stone)}</StoneCount>
                        </StoneButton>
                    ))}
                </BlockList>
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
                                <TypeCount>{countByType(type)}</TypeCount>
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
    top: calc(80px + 14px);
    align-self: flex-start;
    max-height: calc(100vh - 80px - 34px);
    overflow-y: auto;

    @media (max-width: 768px) {
        width: 100%;
        position: static;
        max-height: none;
        overflow-y: visible;
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

const StoneImage = styled.img`
    width: 22px;
    height: 22px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
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
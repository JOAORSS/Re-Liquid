import { useState } from "react";
import { styled } from "@linaria/react";
import { injectLiquid } from "../../../util/shopify";
import type { TBundleData } from "../../../types/store.types";

interface ProductBundleProps {
    bundle: TBundleData;
    onAddBundle: (mainId: number, quantity: number, bundleIds: number[]) => Promise<any>;
}

const CurrencySymbol = injectLiquid<string>(`cart.currency.symbol | json`) || "$";

export function ProductBundle({ bundle, onAddBundle }: ProductBundleProps) {
    const [bundleSelected, setBundleSelected] = useState<Set<number>>(new Set([0, 1]));
    const [isAdding, setIsAdding] = useState(false);

    if (!bundle || bundle.items.length === 0) {
        return null;
    }

    const toggleBundle = (index: number) => {
        if (index === 0) {
            return;
        }

        setBundleSelected((prev) => {
            const next = new Set(prev);
            if (next.has(index)) {
                next.delete(index);
            } else {
                next.add(index);
            }
            return next;
        });
    };

    const safePrice = (val: string | number) => {
        if (typeof val === "number") return val;
        return Number(String(val).replace(/,/g, '')) || 0;
    };

    const selectedItems = bundle.items.filter((_, i) => bundleSelected.has(i));
    
    const rawTotal = selectedItems.reduce((acc, item) => acc + safePrice(item.price), 0);

    const appliedDiscount = bundleSelected.size > 1 ? bundle.discount : 0;
    const finalTotal = rawTotal * (1 - (appliedDiscount / 100));
    const bundleSave = rawTotal - finalTotal;
    
    const isBundleEmpty = bundleSelected.size <= 1;

    const handleAddToCart = async () => {
        setIsAdding(true);
        try {
            const mainId = selectedItems[0].id;
            const bundleIds = selectedItems.slice(1).map(item => item.id);
            
            await onAddBundle(mainId, 1, bundleIds);
        } catch (error) {
            console.error(error);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <BundleBox>
            <BundleHead>
                <h2>Create Your Bundle & Save</h2>
                <p>Add complementary pieces and get up to {bundle.discount}% off</p>
            </BundleHead>
            <BundleItems>
                {bundle.items.map((item, i) => (
                    <BundleItemRow
                        key={i}
                        selected={bundleSelected.has(i)}
                        onClick={() => toggleBundle(i)}
                    >
                        <BundleCheck selected={bundleSelected.has(i)}>
                            <svg viewBox="0 0 24 24" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </BundleCheck>
                        <BundleThumb>
                            <img src={item.image} alt={item.name} />
                        </BundleThumb>
                        <BundleName>
                            <strong>{item.name}</strong>
                            <span>{item.subtitle}</span>
                        </BundleName>
                        <BundlePrice>{CurrencySymbol}{safePrice(item.price).toFixed(2)}</BundlePrice>
                    </BundleItemRow>
                ))}
            </BundleItems>
            <BundleTotal>
                <div>Bundle total</div>
                <BundleTotalPrice>{CurrencySymbol}{finalTotal.toFixed(2)}</BundleTotalPrice>
                {appliedDiscount > 0 && (
                    <div>You save {bundle.discount}% — {CurrencySymbol}{bundleSave.toFixed(2)}</div>
                )}
            </BundleTotal>
            <BundleCta disabled={isAdding || isBundleEmpty} onClick={handleAddToCart}>
                {isAdding ? "Adding..." : "Add Bundle to Cart"}
            </BundleCta>
        </BundleBox>
    );
}

const BundleBox = styled.div`
    background: var(--plum-light);
    border-radius: 12px;
    padding: 28px;
    margin-bottom: 24px;

    @media (max-width: 768px) { padding: 20px; }
`;

const BundleHead = styled.div`
    text-align: center;
    margin-bottom: 20px;
    h2 { font-family: var(--font-display); font-size: 26px; font-weight: 400; color: var(--plum); }
    p  { font-size: 12px; color: var(--grey); }
`;

const BundleItems = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
`;

const BundleItemRow = styled.div<{ selected: boolean }>`
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 16px;
    background: #fff;
    border-radius: 8px;
    border: 2px solid ${({ selected }) => selected ? "var(--plum)" : "transparent"};
    cursor: pointer;
    transition: all .2s;

    &:hover { border-color: var(--plum); }
`;

const BundleCheck = styled.div<{ selected: boolean }>`
    width: 20px;
    height: 20px;
    border: 2px solid ${({ selected }) => selected ? "var(--plum)" : "#ddd"};
    border-radius: 4px;
    background: ${({ selected }) => selected ? "var(--plum)" : "transparent"};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all .2s;

    svg { width: 12px; height: 12px; stroke: #fff; fill: none; opacity: ${({ selected }) => selected ? 1 : 0}; }
`;

const BundleThumb = styled.div`
    width: 48px;
    height: 48px;
    border-radius: 6px;
    overflow: hidden;
    flex-shrink: 0;
    background: var(--light);
    img { width: 100%; height: 100%; object-fit: cover; }
`;

const BundleName = styled.div`
    flex: 1;
    strong { font-size: 13px; display: block; color: var(--dark); }
    span   { font-size: 11px; color: var(--grey); }
`;

const BundlePrice = styled.div`
    font-size: 14px;
    font-weight: 700;
    color: var(--plum);
    font-family: var(--font-display);
`;

const BundleTotal = styled.div`
    text-align: center;
    padding: 16px;
    background: #fff;
    border-radius: 8px;
    margin-bottom: 12px;
    font-size: 12px;
    color: var(--grey);
`;

const BundleTotalPrice = styled.div`
    font-size: 22px;
    font-weight: 700;
    color: var(--plum);
    font-family: var(--font-display);
    margin: 4px 0;
`;

const BundleCta = styled.button`
    width: 100%;
    padding: 14px;
    background: var(--plum);
    color: #fff;
    border: none;
    font-family: var(--font-body);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 6px;
    transition: background .2s;

    &:hover:not(:disabled) { background: var(--dark); }
    &:disabled { opacity: 0.7; cursor: not-allowed; }
`;
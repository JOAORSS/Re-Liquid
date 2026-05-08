import { useState } from "react";
import { styled } from "@linaria/react";
import { addItemsToCart, injectLiquidRaw } from "../../../util/shopify";
import { ProductBundle } from "../_product-bundle";
import type { TBundleData } from "../../../types/store.types";

interface BenefitProp {
    icon: string;
    label: string;
}

interface ProductInfoProps {
    title: string;
    subtitle?: string;
    price: number;
    compareAtPrice?: number;
    stars?: number;
    rating?: number;
    reviewCount?: number;
    badge?: string;
    cashback?: string;
    couponCode?: string;
    couponLabel?: string;
    shipping?: string;
    stoneTrigger?: { title: string; subtitle: string; targetId: string };
    benefits?: BenefitProp[];
    bundle?: TBundleData;
    descriptionTitle?: string;
    description?: string;
    descriptionItems?: string[];
    sym?: string;
    code?: string;
    installmentsDefault?: number;
}

export function ProductInfo({
    title,
    subtitle,
    price,
    compareAtPrice,
    stars,
    rating,
    reviewCount,
    badge,
    cashback,
    couponCode,
    couponLabel,
    shipping,
    stoneTrigger,
    benefits,
    bundle,
    descriptionTitle,
    description,
    descriptionItems,
    sym,
    code,
    installmentsDefault = 4
}: ProductInfoProps) {
    const [copied, setCopied] = useState(false);
    const installment    = price / installmentsDefault;

    const copyCoupon = () => {
        if (!couponCode) return;
        navigator.clipboard.writeText(couponCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const [isAdding, setIsAdding] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    // @ts-ignore
    const [quantity, setQuantity] = useState(1);
    // @ts-ignore
    const [selectedBundles, setSelectedBundles] = useState<number[]>([]);

    const currentVariantId = injectLiquidRaw<number>(`{{ product.selected_or_first_available_variant.id }}`);

    const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!currentVariantId) {
            return; 
        }

        setIsAdding(true);

        try {
            await addItemsToCart(currentVariantId, quantity, selectedBundles);
            
            setIsSuccess(true);

            const rootUrl = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root)
                ? window.Shopify.routes.root
                : '/';

            setTimeout(() => {
                window.location.href = `${rootUrl}cart`;
            }, 1000);

        } catch (error) {
            setIsAdding(false);
        }
    };

    return (
        <Info>

            <MetaTop>
                {badge && <WaterproofBadge>{badge}</WaterproofBadge>}
                {(stars || rating || reviewCount) && (
                    <Rating>
                        {stars   && <Stars>{"★".repeat(stars)}</Stars>}
                        {rating  && <RatingScore>{rating}</RatingScore>}
                        {reviewCount && <RatingCount>· {reviewCount.toLocaleString()} reviews</RatingCount>}
                    </Rating>
                )}
            </MetaTop>

            <Title>{title}</Title>
            {subtitle && <Subtitle>{subtitle}</Subtitle>}

            {cashback && (
                <Cashback>
                    <svg viewBox="0 0 24 24" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M15 9.5a3 3 0 0 0-3-2.5H9.5a2.5 2.5 0 0 0 0 5h5a2.5 2.5 0 0 1 0 5H12a3 3 0 0 1-3-2.5"/></svg>
                    {cashback}
                </Cashback>
            )}

            <PriceRow>
                <Price>{sym}{price} {code}</Price>
                {compareAtPrice && <PriceOld>{sym}{compareAtPrice}</PriceOld>}
                {compareAtPrice && (
                    <PriceOff>
                        {Math.round((1 - price / compareAtPrice) * 100)}% OFF
                    </PriceOff>
                )}
            </PriceRow>
            <Installments>
                or 4 interest-free payments of {sym}{installment} with Afterpay
            </Installments>

            {couponCode && (
                <CouponBar onClick={copyCoupon}>
                    <svg viewBox="0 0 24 24" strokeWidth="1.5"><path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6"/><polyline points="16 2 22 2 22 8"/><line x1="22" y1="2" x2="12" y2="12"/></svg>
                    <CouponTxt><strong>{couponLabel ?? "10% OFF"}</strong> your first order — Use code:</CouponTxt>
                    <CouponCode style={copied ? {opacity: 0} : {}}  >{couponCode}</CouponCode>
                    {copied && <CouponCopied>Copied!</CouponCopied>}
                </CouponBar>
            )}

            {shipping && (
                <ShippingNote>
                    <svg viewBox="0 0 24 24" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                    {shipping}
                </ShippingNote>
            )}

            {stoneTrigger && stoneTrigger.title !== undefined && (
                <StoneTrigger href={stoneTrigger.targetId}>
                    <svg viewBox="0 0 24 24" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                    <StoneTriggerTxt>
                        <strong>About {stoneTrigger.title}</strong>
                        <span>{stoneTrigger.subtitle}</span>
                    </StoneTriggerTxt>
                    <svg viewBox="0 0 24 24" strokeWidth="1.5" style={{ width: 16, height: 16, stroke: "#bbb", fill: "none", flexShrink: 0 }}>
                        <polyline points="9 18 15 12 9 6"/>
                    </svg>
                </StoneTrigger>
            )}

            <CtaBtn
                type="button"
                onClick={handleAddToCart}
                disabled={isAdding || isSuccess}
                className={`react-btn-add ${isAdding ? 'is-adding' : ''} ${isSuccess ? 'is-added' : ''}`}
            >
                {isAdding ? "Adding..." : isSuccess ? "Added!" : `Add to Cart — ${sym}${price}`}
            </CtaBtn>

            {benefits && benefits.length > 0 && (
                <Benefits>
                    {benefits.map((benefit, i) => (
                        <BenefitItem key={i}>
                            <span dangerouslySetInnerHTML={{ __html: benefit.icon }} />
                            <span>{benefit.label}</span>
                        </BenefitItem>
                    ))}
                </Benefits>
            )}

            {bundle && bundle.items.length > 1 && (
                <ProductBundle bundle={bundle} onAddBundle={addItemsToCart} />
            )}

            {(descriptionTitle || description || descriptionItems) && (
                <Desc>
                    {descriptionTitle && <h3>{descriptionTitle}</h3>}
                    {description && <p dangerouslySetInnerHTML={{ __html: description }} />}
                    {descriptionItems && (
                        <ul>
                            {descriptionItems.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    )}
                </Desc>
            )}

        </Info>
    );
}


const Info = styled.div`
    font-family: var(--font-display);
`;

const MetaTop = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 10px;
`;

const WaterproofBadge = styled.span`
    font-size: 11px;
    font-weight: 600;
    color: var(--plum);
    background: var(--plum-light);
    padding: 4px 10px;
    border-radius: 20px;
    letter-spacing: .5px;
`;

const Rating = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
`;

const Stars = styled.span`
    color: #f5a623;
    font-size: 14px;
    letter-spacing: 1px;
`;

const RatingScore = styled.span`
    font-size: 13px;
    font-weight: 700;
    color: var(--dark);
`;

const RatingCount = styled.span`
    font-size: 12px;
    color: var(--grey);
`;

const Title = styled.h1`
    font-family: var(--font-display);
    font-size: 32px;
    font-weight: 400;
    color: var(--dark);
    line-height: 1.25;
    margin-bottom: 6px;

    @media (max-width: 768px) { font-size: 24px; }
`;

const Subtitle = styled.div`
    font-size: 12px;
    color: var(--grey);
    margin-bottom: 14px;
`;

const Cashback = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--plum-light);
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    color: #a0917f;
    margin-bottom: 24px;

    svg { width: 14px; height: 14px; stroke: #a0917f; fill: none; }
`;

const PriceRow = styled.div`
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 10px;
`;

const Price = styled.span`
    font-size: 28px;
    font-weight: 700;
    color: var(--dark);
    font-family: var(--font-display);

    @media (max-width: 768px) { font-size: 24px; }
`;

const PriceOld = styled.span`
    font-size: 16px;
    color: #ccc;
    text-decoration: line-through;
    font-family: var(--font-display);
`;

const PriceOff = styled.span`
    font-size: 12px;
    font-weight: 700;
    color: #c44;
    background: #fde8e8;
    padding: 3px 10px;
    border-radius: 12px;
`;

const Installments = styled.div`
    font-size: 12px;
    color: var(--grey);
    margin-bottom: 22px;
    font-family: var(--font-display);
`;

const CouponBar = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    background: var(--plum-light);
    border-radius: 8px;
    margin-bottom: 22px;
    cursor: pointer;
    transition: background .2s;

    &:hover { background: #e6d8cd; }
    svg { width: 16px; height: 16px; stroke: var(--plum); fill: none; flex-shrink: 0; }
`;

const CouponTxt = styled.span`
    flex: 1;
    font-size: 12px;
    color: var(--plum);
    strong { font-weight: 700; }
`;

const CouponCode = styled.span`
    font-size: 11px;
    font-weight: 700;
    color: var(--plum);
    background: #fff;
    padding: 4px 12px;
    border-radius: 4px;
    border: 1px solid var(--plum);
    letter-spacing: 1px;
`;

const CouponCopied = styled.span`
    font-size: 11px;
    color: var(--plum);
    font-weight: 600;
`;

const ShippingNote = styled.div`
    font-size: 12px;
    color: #2a9d5c;
    font-weight: 600;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 6px;
    svg { width: 14px; height: 14px; stroke: #2a9d5c; fill: none; }
`;

const StoneTrigger = styled.a`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    background: var(--light);
    border-radius: 8px;
    margin-bottom: 20px;
    cursor: pointer;
    transition: all .2s;
    border: 1px solid var(--border);
    text-decoration: none;

    &:hover { border-color: var(--plum); background: var(--plum-light); }
    svg:first-child { width: 20px; height: 20px; stroke: var(--plum); fill: none; flex-shrink: 0; }
`;

const StoneTriggerTxt = styled.div`
    flex: 1;
    strong { font-size: 13px; display: block; color: var(--dark); margin-bottom: 1px; }
    span   { font-size: 11px; color: var(--grey); }
`;

const CtaBtn = styled.button`
    width: 100%;
    padding: 16px;
    background: var(--dark);
    color: #fff;
    border: none;
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 6px;
    transition: all .3s;
    margin-bottom: 16px;

    &:hover { background: var(--plum); }
`;

const Benefits = styled.div`
    display: flex;
    gap: 12px;
    margin-bottom: 24px;

    @media (max-width: 768px) {
        flex-wrap: wrap;
    }
`;

const BenefitItem = styled.div`
    flex: 1;
    text-align: center;
    padding: 12px 8px;
    background: var(--light);
    border-radius: 8px;

    svg  { width: 20px; height: 20px; stroke: var(--plum); fill: none; margin: 0 auto 6px; display: block; }
    span { display: block; font-size: 10px; color: var(--grey); line-height: 1.4; }

    @media (max-width: 768px) {
        flex: 0 0 calc(33% - 8px);
    }
`;

const Desc = styled.div`
    padding-top: 24px;
    border-top: 1px solid var(--border);

    h3 { font-family: var(--font-display); font-size: 1.25rem; font-weight: 500; margin-bottom: 12px; }
    p  { font-size: 1rem; color: #666; line-height: 1.3; margin-bottom: 12px; }
    ul { padding-left: 18px; margin-bottom: 12px; }
    li { font-size: 1rem; color: #666; line-height: 1.8; margin-bottom: 4px; }

    @media screen and (max-width: 768px) {
        li { 
            font-size: .875rem;
            font-weight: 500;
        }
    }
`;
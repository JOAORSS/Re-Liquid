import { styled } from "@linaria/react";
import { calculateProductRating, injectLiquid } from "../../util/shopify";

export function ProductCard(
 {    
    id,
    name,
    stone,
    image,
    imageHover,
    badge,
    subTitle,
    showStars = true,
    showRate = true,
    showViwes = true,
    price,
    currency,
    url,
    stockTag,
    tamMin = "128px"
 }: {  
    id: number;
    name?: string;
    stone?: string;
    image?: string;
    imageHover?: string;
    badge?: string;
    subTitle?: string;
    showStars?: boolean;
    showRate?: boolean;
    showViwes?: boolean;
    price?: number;
    currency?: string;
    url?: string;
    stockTag?: string;
    tamMin?: string;
 }) {

    if (!image) return null;

    const CurrencyCode = injectLiquid<string>(`cart.currency.iso_code | json`);
    const CurrencySymbol = injectLiquid<string>(`cart.currency.symbol | json`);

    const { rating, reviewCount } = calculateProductRating(id);

    return (
        <Card href={url} tamMin={tamMin}>
            <div className="image-container">
                {badge && <Badge background="var(--dark)" left="10px" right="auto" color="#fff">{badge}</Badge>}
                {stockTag && 
                    <Badge 
                        background={`var(${stockTag === "Out of Stock" ? "--out-of-stock" : "--only-three"})`}
                        right="10px" 
                        left="auto" 
                        color={`${stockTag === "Out of Stock" ? "#c44" : "#7d5a00"}`}>
                            {stockTag}
                    </Badge>
                }
                <Image src={image} alt={name} />
                {imageHover && !imageHover.includes('.gif') && (
                    <HoverImage 
                        src={imageHover} 
                        alt={`${name} hover`} 
                        className="hover-image" 
                    />
                )}
                <ViewProduct className="view-product">
                    View Product
                </ViewProduct>
            </div>
            <div>
                {stone && <Stone>{stone}</Stone>}
                {name && <Name>{name}</Name>}
                {subTitle && <Sub>{subTitle}</Sub>}
                <div>
                    {showStars && <Stars>{'★'.repeat(rating)}</Stars>}
                    {showRate && <Rate>{rating}</Rate>}
                    {showViwes && <Viwes>{reviewCount}</Viwes>}
                </div>
                <PriceContainer>
                    {price && <Price>{CurrencySymbol}{price}</Price>}
                    {currency ? <Currency>{currency}</Currency> : <Currency>{CurrencyCode}</Currency>}
                </PriceContainer>
            </div>
        </Card>
    );
}

const Card = styled.a<{ tamMin?: string }>` 
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    max-width: 278px;
    min-width: 128px;
    font-family: var(--font-display);
    animation: slideIn 0.3s ease-in-out forwards;
    
    @media (max-width: 768px) {
        min-width: ${props => props.tamMin || "128px"};
    }

    @keyframes slideIn {
        from {
            transform: translateY(20px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    .image-container {
        position: relative;
        aspect-ratio: 1;
        overflow: hidden;
        border-radius: 8px;
        background: var(--light);
        margin-bottom: 10px;
    }

    .image-container:hover .hover-image {
        opacity: 1;
    }

    .image-container:hover .view-product {
        transform: translateY(0);
    }

    & > div:last-child {
        padding: 0 2px;
    }

    & > div:last-child > div:last-of-type {
        display: flex;
        align-items: baseline;
        gap: 5px;
    }

    & > div:last-child > div:first-of-type {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-bottom: 6px;
    }
`;

const Badge = styled.span<{ left: string, right: string, background: string, color: string }>`
    position: absolute;
    top: 10px;
    left: ${props => props.left};
    right: ${props => props.right};
    font-size: 9px;
    font-family: var(--font-display);
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    background: ${props => props.background};
    color: ${props => props.color};
    padding: 3px 8px;
    border-radius: 20px;
    z-index: 2;
`;

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
`;

const HoverImage = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.45s ease;
    z-index: 1;
`;

const ViewProduct = styled.span`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 12px;
    background: rgba(67, 41, 34, 0.92);
    color: #fff;
    font-family: var(--font-display);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    text-align: center;
    transform: translateY(100%);
    transition: transform 0.3s;
    z-index: 2;
    display: block;
`;

const Stone = styled.p<{ children: React.ReactNode }>`
    font-size: 9px;
    font-family: var(--font-display);
    font-weight: 700;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 3px;
`;

const Name = styled.h3<{ children: React.ReactNode }>`
    font-size: 13px;
    font-weight: 500;
    color: var(--dark);
    line-height: 1.3;
    margin-bottom: 3px;
    font-family: var(--font-display);
    display: block;
    transition: color 0.2s;

    &:hover {
        color: var(--plum);
    }
`;

const Sub = styled.p<{ children: React.ReactNode }>`
    font-size: 11px;
    color: var(--grey);
    margin-bottom: 5px;
    font-family: var(--font-display);
    line-height: 1.4;
    max-width: 75%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const Stars = styled.span<{ children: React.ReactNode }>`
    color: #f5a623;
    font-size: 11px;
    letter-spacing: 0.5px;
`;

const Rate = styled.b<{ children: React.ReactNode }>`
    font-size: 11px;
    font-weight: 700;
    color: var(--dark);
`;

const Viwes = styled.p<{ children: React.ReactNode }>`
    font-size: 10px;
    color: #75543f;
`;

const Price = styled.span<{ children: React.ReactNode }>`
    font-size: 14px;
    font-weight: 700;
    color: var(--dark);
`;

const Currency = styled.span<{ children: React.ReactNode }>`
    font-size: 10px;
    font-weight: 700;
    color: var(--dark);
`;

const PriceContainer = styled.div`
    display: flex;
    align-items: baseline;
    justify-content: flex-start;
    gap: 5px;
`;
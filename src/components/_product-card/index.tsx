import { styled } from "@linaria/react";
import { injectLiquid } from "../../util/shopify";

export function ProductCard(
 {    
    name,
    stone,
    image,
    imageHover,
    badge,
    subTitle,
    stars,
    rate,
    viwes,
    price,
    currency
 }: {    
    name?: string;
    stone?: string;
    image?: string;
    imageHover?: string;
    badge?: string;
    subTitle?: string;
    stars?: number;
    rate?: number;
    viwes?: number;
    price?: number;
    currency?: string;
 }) {

    if (!image) return null;

    const CurrencyCode = injectLiquid<string>(`cart.currency.iso_code | json`);
    const CurrencySymbol = injectLiquid<string>(`cart.currency.symbol | json`);

    return (
        <Card>
            <div className="image-container">
                {badge && <Badge>{badge}</Badge>}
                <Image src={image} alt={name} />
                {imageHover && (
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
                    {stars && <Stars>{'★'.repeat(stars)}</Stars>}
                    {rate && <Rate>{rate}</Rate>}
                    {viwes && <Viwes>{viwes}</Viwes>}
                </div>
                <PriceContainer>
                    {price && <Price>{CurrencySymbol}{price}</Price>}
                    {currency ? <Currency>{currency}</Currency> : <Currency>{CurrencyCode}</Currency>}
                </PriceContainer>
            </div>
        </Card>
    );
}

const Card = styled.a` 
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    max-width: 278px;
    min-width: 128px;

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

const Badge = styled.span`
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    background: var(--dark);
    color: #fff;
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
    font-family: 'Barlow', sans-serif;
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
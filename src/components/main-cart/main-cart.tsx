import { useState, useEffect } from "react";
import { styled } from "@linaria/react";
import { injectLiquid } from "../../util/shopify";

interface CartItemData {
    key: string;
    product_title: string;
    url: string;
    image: string;
    price: number;
    quantity: number;
    final_line_price: number;
}

interface CartData {
    items: CartItemData[];
    total_price: number;
    item_count: number;
}

const tTitle = injectLiquid<string>(`'cart.title' | t | json`) || "Your Cart";
const tRemove = injectLiquid<string>(`'cart.remove' | t | json`) || "Remove";
const tCheckout = injectLiquid<string>(`'cart.checkout' | t | json`) || "Checkout";
const currency = injectLiquid<string>(`cart.currency.symbol | json`) || "$";

export function CartPage() {
    const [cart, setCart] = useState<CartData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const rootUrl = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root)
        ? window.Shopify.routes.root
        : '/';

    const fetchCart = async () => {
        try {
            const response = await fetch(`${rootUrl}cart.js`);
            const data = await response.json();
            setCart(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const updateQuantity = async (key: string, quantity: number) => {
        setIsUpdating(true);
        try {
            const response = await fetch(`${rootUrl}cart/change.js`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: key,
                    quantity: quantity
                })
            });
            const data = await response.json();
            setCart(data);
            
            document.querySelectorAll('[data-cart-count]').forEach(el => {
                el.textContent = data.item_count.toString();
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return <LoaderPlaceholder />;
    }

    if (!cart || cart.items.length === 0) {
        return (
            <EmptyCartContainer>
                <h2>{tTitle}</h2>
                <p>Your cart is currently empty.</p>
                <a href={rootUrl}>Continue Shopping</a>
            </EmptyCartContainer>
        );
    }

    return (
        <CartSection>
            <CartGrid>
                <CartItemsList>
                    {cart.items.map((item) => (
                        <CartItem key={item.key} isUpdating={isUpdating}>
                            <ItemImage href={item.url}>
                                {item.image ? (
                                    <img src={item.image} alt={item.product_title} />
                                ) : (
                                    <div className="placeholder" />
                                )}
                            </ItemImage>
                            <ItemInfo>
                                <ItemTitle href={item.url}>{item.product_title}</ItemTitle>
                                <ItemPrice>{currency}{(item.price / 100).toFixed(2)}</ItemPrice>
                                
                                <ItemActions>
                                    <QuantityControl>
                                        <button 
                                            disabled={isUpdating} 
                                            onClick={() => updateQuantity(item.key, item.quantity - 1)}
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button 
                                            disabled={isUpdating} 
                                            onClick={() => updateQuantity(item.key, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </QuantityControl>
                                    <RemoveButton 
                                        disabled={isUpdating} 
                                        onClick={() => updateQuantity(item.key, 0)}
                                    >
                                        {tRemove}
                                    </RemoveButton>
                                </ItemActions>
                            </ItemInfo>
                            <LinePrice>{currency}{(item.final_line_price / 100).toFixed(2)}</LinePrice>
                        </CartItem>
                    ))}
                </CartItemsList>

                <CartSummary>
                    <SummaryCard>
                        <h2>Order Summary</h2>
                        <SummaryRow>
                            <span>Subtotal</span>
                            <strong>{currency}{(cart.total_price / 100).toFixed(2)}</strong>
                        </SummaryRow>
                        <p className="taxes-note">Taxes and shipping calculated at checkout</p>
                        
                        <form action={`${rootUrl}cart`} method="post">
                            <CheckoutButton type="submit" name="checkout" disabled={isUpdating}>
                                {tCheckout}
                            </CheckoutButton>
                        </form>
                    </SummaryCard>
                </CartSummary>
            </CartGrid>
        </CartSection>
    );
}

const LoaderPlaceholder = styled.div`
    min-height: 50vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const EmptyCartContainer = styled.div`
    text-align: center;
    padding: 80px 20px;
    font-family: var(--font-body);
    min-height: 50vh;  

    h2 {
        font-family: var(--font-display);
        font-size: 32px;
        color: var(--plum);
        margin-bottom: 16px;
    }

    p {
        color: var(--grey);
        margin-bottom: 24px;
    }

    a {
        display: inline-block;
        padding: 12px 24px;
        background-color: var(--plum);
        color: #fff;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        font-size: 11px;
        transition: background 0.2s;

        &:hover {
            background-color: var(--dark);
        }
    }
`;

const CartSection = styled.section`
    min-height: 50vh;
    width: 100%;
    margin: 0 auto;
    padding: 40px 20px;
    font-family: var(--font-body);
`;

const CartGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 48px;
    align-items: start;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 32px;
    }
`;

const CartItemsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

const CartItem = styled.div<{ isUpdating: boolean }>`
    display: grid;
    grid-template-columns: 120px 1fr auto;
    gap: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--border);
    opacity: ${(props) => (props.isUpdating ? 0.6 : 1)};
    pointer-events: ${(props) => (props.isUpdating ? "none" : "auto")};
    transition: opacity 0.2s;

    @media (max-width: 768px) {
        grid-template-columns: 90px 1fr;
        grid-template-rows: auto auto;
        gap: 16px;
    }
`;

const ItemImage = styled.a`
    width: 100%;
    aspect-ratio: 1;
    border-radius: 8px;
    overflow: hidden;
    background: var(--light);
    display: block;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .placeholder {
        width: 100%;
        height: 100%;
        background: var(--border);
    }
`;

const ItemInfo = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const ItemTitle = styled.a`
    font-family: var(--font-display);
    font-size: 18px;
    color: var(--dark);
    text-decoration: none;
    font-weight: 600;

    &:hover {
        color: var(--plum);
    }
`;

const ItemPrice = styled.div`
    font-size: 13px;
    color: var(--grey);
`;

const ItemActions = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: auto;
    padding-top: 12px;

    @media (max-width: 768px) {
        flex-wrap: wrap;
    }
`;

const QuantityControl = styled.div`
    display: flex;
    align-items: center;
    border: 1px solid var(--border);
    border-radius: 4px;
    height: 36px;

    button {
        background: none;
        border: none;
        width: 32px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: var(--dark);
        font-size: 16px;

        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    }

    span {
        width: 32px;
        text-align: center;
        font-size: 13px;
        font-weight: 600;
        color: var(--dark);
    }
`;

const RemoveButton = styled.button`
    background: none;
    border: none;
    font-family: var(--font-body);
    font-size: 11px;
    color: var(--grey);
    text-decoration: underline;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 1px;

    &:hover {
        color: var(--dark);
    }
`;

const LinePrice = styled.div`
    font-family: var(--font-display);
    font-size: 18px;
    font-weight: 700;
    color: var(--dark);
    text-align: right;

    @media (max-width: 768px) {
        grid-column: 1 / -1;
        text-align: left;
    }
`;

const CartSummary = styled.div`
    position: sticky;
    top: 40px;
`;

const SummaryCard = styled.div`
    background: var(--plum-light);
    border-radius: 12px;
    padding: 32px;

    h2 {
        font-family: var(--font-display);
        font-size: 22px;
        color: var(--dark);
        margin-bottom: 24px;
        font-weight: 400;
    }

    .taxes-note {
        font-size: 12px;
        color: var(--grey);
        margin-bottom: 24px;
        text-align: center;
    }
`;

const SummaryRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);

    span {
        font-size: 14px;
        color: var(--dark);
    }

    strong {
        font-family: var(--font-display);
        font-size: 24px;
        color: var(--plum);
    }
`;

const CheckoutButton = styled.button`
    width: 100%;
    padding: 16px;
    background: var(--plum);
    color: #fff;
    border: none;
    font-family: var(--font-body);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 6px;
    transition: background 0.2s;

    &:hover:not(:disabled) {
        background: var(--dark);
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;
import type { Settings } from "./main-header.types";
import { injectLiquid, injectLiquidRaw } from '../../util/shopify';
import "./main-header.css"

declare global {
    interface Window {
        Header: typeof Header;
    }
}

const ShopifyAccount = 'shopify-account' as any;

export function Header(props: { settings: Settings }) {
    const shopName    = injectLiquid<string>("shop.name | link_to: routes.root_url | json");
    const cartCount   = injectLiquid<number>("cart.item_count | json");
    const iconCart    = injectLiquid<string>("'icon-cart.svg' | inline_asset_content | json");
    const iconAccount = injectLiquid<string>("'icon-account.svg' | inline_asset_content | json");

    const menuLinks = injectLiquidRaw<any[]>(`{%- if section.settings.menu -%} 
                                                [{%- for link in linklists[section.settings.menu].links -%} 
                                                        { "title": {{ link.title | json }}, "url": {{ link.url | json }} } 
                                                        {%- unless forloop.last -%},{%- endunless -%} 
                                                    {%- endfor -%}] 
                                            {%- else -%} [] {%- endif -%}`);

    const customerAccountsEnabled = injectLiquid<boolean>("shop.customer_accounts_enabled | json");    
    const cartRoute = injectLiquid<string>("routes.cart_url | json");

    return (
        <header className="header">
            
            <h2 dangerouslySetInnerHTML={{ __html: shopName }} />

            <div className="header__menu">
                {menuLinks && menuLinks.map((link, index) => (
                    <a key={index} href={link.url}>{link.title}</a>
                ))}
            </div>

            <div className="header__icons">
                {customerAccountsEnabled && (
                    <ShopifyAccount menu={props.settings.customer_account_menu}>
                        <span dangerouslySetInnerHTML={{ __html: iconAccount }} />
                    </ShopifyAccount>
                )}

                <a href={cartRoute}> 
                    {cartCount > 0 && <sup> {cartCount} </sup>} 
                    <span dangerouslySetInnerHTML={{ __html: iconCart }} />
                </a>
            </div>
        </header>
    );
}

(window as any)['main-header'] = Header;
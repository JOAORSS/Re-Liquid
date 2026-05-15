import type { Settings } from "./main-header.types";
import { injectLiquid, injectLiquidRaw } from '../../util/shopify';
import "./main-header.css"
import { useState } from "react";
import { MobileNav } from "./mobile-nav";

export function Header(props: { settings: Settings }) {

    const shopName        = injectLiquid<string>("shop.name | json");
    const linkRoot        = injectLiquid<string>("routes.root_url | json");
    const cartCount       = injectLiquid<string>("cart.item_count | json");
    const iconCart        = injectLiquid<string>("'icon-cart.svg' | inline_asset_content | json");
    const iconSearch      = injectLiquid<string>("'icon-search.svg' | inline_asset_content | json");
    const linkSearch      = injectLiquid<string>("routes.search_url | json");
    const iconAccount     = injectLiquid<string>("'icon-account.svg' | inline_asset_content | json");
    const cartRoute       = injectLiquid<string>("routes.cart_url | json");
    const accountsEnabled = injectLiquid<boolean>("shop.customer_accounts_enabled | json");

    const accountLink     = injectLiquidRaw<string>(`
        {%- if customer -%}
            {{ routes.account_url | json }}
        {%- else -%}
            {{ routes.account_login_url | json }}
        {%- endif -%}
    `);

    const [openMobileMenu, setOpenMobileMenu] = useState(false);

    return (
        <>
        <header className="header"> 
            <span className="hamburger" onClick={() => setOpenMobileMenu(true)}>
                <span></span>
                <span></span>
                <span></span>
            </span>

            {props.settings.image_logo_settings != null 
                ? <a href={linkRoot}><img src={props.settings.image_logo_settings} className="logo" alt={shopName}></img></a>
                : <a href={linkRoot} dangerouslySetInnerHTML={{ __html: shopName }} />
            }            

            <div className="header__icons">
                <a href={linkSearch} dangerouslySetInnerHTML={{ __html: iconSearch }} />

                {accountsEnabled && (
                    <a href={accountLink}>
                        <span dangerouslySetInnerHTML={{ __html: iconAccount }} />
                    </a>
                )}

                <a href={cartRoute}> 
                    <sup>{cartCount}</sup>
                    <span dangerouslySetInnerHTML={{ __html: iconCart }} />
                </a>
            </div>
        </header>
        <MobileNav menuHandle={'main-menu'} open={openMobileMenu} onClose={() => setOpenMobileMenu(false)} />
        </>
    );
}
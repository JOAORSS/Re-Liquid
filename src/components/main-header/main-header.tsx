import type { Settings } from "./main-header.types";
import { injectLiquid } from '../../util/shopify';
import "./main-header.css"

const ShopifyAccount = 'shopify-account' as any;

export function Header(props: { settings: Settings }) {
    const shopName        = injectLiquid<string>("shop.name | link_to: routes.root_url | json");
    const linkRoot        = injectLiquid<string>("routes.root_url | json");
    const cartCount       = injectLiquid<number>("cart.item_count | json");
    const iconCart        = injectLiquid<string>("'icon-cart.svg' | inline_asset_content | json");
    const iconAccount     = injectLiquid<string>("'icon-account.svg' | inline_asset_content | json");
    const cartRoute       = injectLiquid<string>("routes.cart_url | json");
    const accountsEnabled = injectLiquid<boolean>("shop.customer_accounts_enabled | json");    


    return (
        <header className="header"> 
            {props.settings.image_logo_settings != null 
                ? <a href={linkRoot}><img src={props.settings.image_logo_settings} className="logo" alt={shopName}></img></a>
                : shopName
            }            

            <div className="header__icons">
                {accountsEnabled && (
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
import { injectLiquid } from "../../util/shopify";
import ShowcaseContainer from "../_showcase-container";
import "./main-footer.css";
import type { Settings } from "./main-footer.types";

declare global {
  interface Window {
    storeLinklists?: Record<string, {title: string, url: string}[]>;
  }
}

export function Footer(props: { settings: Settings, blocks: any[] }) {

    const logoNext    = injectLiquid<string>("'Nextt.png' | asset_img_url: 'medium'| json ");
    const description = props.settings.description;
    const email       = props.settings.email;
    const address     = props.settings.address;
    const copyright   = props.settings.copyright;

    const menus = [
        {
            title: props.settings.menu_1_title,
            handle: props.settings.menu_1
        },
        {
            title: props.settings.menu_2_title,
            handle: props.settings.menu_2            
        },
        {
            title: props.settings.menu_3_title,
            handle: props.settings.menu_3,
        }
    ];

    return (
        <>
        <ShowcaseContainer
            fullContainer={"var(--content-width)"}
            header={false}
            orientation="column"
            backgroundColor="var(--dark)"
        >
        <footer className="footer">    
            <div className="footer-menus">
            
                <div className="about-us">
                    <img className="about-us__logo" src={props.settings.logo || "#"} alt="Logo" /> 
                    <p className="about-us__description">{description}</p> 
                </div>                

                {menus.map((menu, Idx) => {
                    const menuLinks = menu.handle && (window as any).shopifyMenus[menu.handle];

                    return (
                        <div key={`menu-${Idx}`} className="menu">
                            <h4 className="menu__title">{menu.title}</h4>
                            
                            {menuLinks.map((link: {title: string, url: string}, linkIdx: number) => (
                                <a className="menu__link" key={`link-${Idx}-${linkIdx}`} href={link.url}>{link.title}</a>
                            ))}
                        </div>
                    );
                })}

                <div className="menu">
                    <h4 className="menu__title" >Contact</h4>
                    <p className="menu__link">{address}</p>
                    <p className="menu__link"><a href={`mailto:${email}`}>{email}</a></p>
                </div>
            </div>
            <div className="copyright">
                <span className="copyright__text">{copyright}</span>
                <a className="copyright__logo" href="https://nextt-media.com" target="_blank" rel="noopener noreferrer">
                    <img alt="Nextt media" src={logoNext} />
                </a>
            </div>
        </footer>

        </ShowcaseContainer>
      </>
    );
}
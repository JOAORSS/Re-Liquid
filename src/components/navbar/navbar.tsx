import type { Settings } from "./navbar.types";
import { injectLiquidRaw } from '../../util/shopify';
import "./navbar.css"

export function Navbar(props: { settings: Settings }) {

    props;
    const menuLinks = injectLiquidRaw<any[]>(`{%- if section.settings.menu -%} 
                                                [{%- for link in linklists[section.settings.menu].links -%} 
                                                    { "title": {{ link.title | json }}, "url": {{ link.url | json }} } 
                                                    {%- unless forloop.last -%},{%- endunless -%} 
                                                {%- endfor -%}] 
                                              {%- else -%} [] {%- endif -%}`);

    return (
        <nav className="navbar">
            {menuLinks && menuLinks.map((link, index) => (
                <a key={index} href={link.url}>{link.title}</a>
            ))}
        </nav>
    );
}
import type { Settings } from "./navbar.types";
import { injectLiquidRaw } from '../../util/shopify';
import "./navbar.css"

export function Navbar(props: { settings: Settings }) {

    const shopifyMenus = injectLiquidRaw<any>(`
        {
            {%- for linklist in linklists -%}
                {{ linklist.handle | json }}: [
                    {%- for link in linklist.links -%}
                        {
                            "title": {{ link.title | json }},
                            "url": {{ link.url | json }},
                            "links": [
                                {%- for child_link in link.links -%}
                                    {
                                        "title": {{ child_link.title | json }},
                                        "url": {{ child_link.url | json }},
                                        "links": [
                                            {%- for grandchild_link in child_link.links -%}
                                                {
                                                    "title": {{ grandchild_link.title | json }},
                                                    "url": {{ grandchild_link.url | json }}
                                                }
                                                {%- unless forloop.last -%},{%- endunless -%}
                                            {%- endfor -%}
                                        ]
                                    }
                                    {%- unless forloop.last -%},{%- endunless -%}
                                {%- endfor -%}
                            ]
                        }
                        {%- unless forloop.last -%},{%- endunless -%}
                    {%- endfor -%}
                ]
                {%- unless forloop.last -%},{%- endunless -%}
            {%- endfor -%}
        }
    `);
    
    (window as any).shopifyMenus = shopifyMenus;
    
    const menuLinks = props.settings.menu && (window as any).shopifyMenus[props.settings.menu];

    return (
        <nav className="navbar">
            {menuLinks && menuLinks.length > 0 && menuLinks.map((link: any, index: number) => (
                <a key={index} href={link.url}>{link.title}</a>
        ))}
    </nav>
);
}
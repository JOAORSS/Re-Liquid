import { useState, useRef } from "react";
import type { Settings } from "./navbar.types";
import { injectLiquidRaw } from '../../util/shopify';
import "./navbar.css"

declare global {
  interface Window { shopifyMenus: any; }
}

interface NavLink {
  title: string;
  url: string;
  links: NavLink[];
}

export function Navbar(props: { settings: Settings, mobile?: boolean }) {
  const [activeLink,  setActiveLink]  = useState<NavLink | null>(null);
  const [activeChild, setActiveChild] = useState<NavLink | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

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
                          "url": {{ grandchild_link.url | json }},
                          "links": []
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

  window.shopifyMenus = shopifyMenus;
  const menuLinks: NavLink[] = props.settings.menu && window.shopifyMenus[props.settings.menu];

  const handleLinkEnter = (link: NavLink) => {
    setActiveLink(link.links?.length > 0 ? link : null);
    setActiveChild(null);
  };

  const handleChildEnter = (child: NavLink) => {
    setActiveChild(child.links?.length > 0 ? child : null);
  };

  const handleWrapperLeave = () => {
    setActiveLink(null);
    setActiveChild(null);
  };

  return (
    <div
      className="navbar-wrapper"
      ref={wrapperRef}
      onMouseLeave={handleWrapperLeave}
    >
      <nav className="navbar">
        {menuLinks?.length > 0 && menuLinks.map((link, i) => (
        <a          
            key={i}
            href={link.url}
            className={activeLink?.url === link.url ? "active" : ""}
            onMouseEnter={() => handleLinkEnter(link)}
            onFocus={() => handleLinkEnter(link)}
            onKeyDown={(e: React.KeyboardEvent<HTMLAnchorElement>) => {
              if (e.key === 'Escape') handleWrapperLeave();
            }}
          >
            {link.title}
          </a>
        ))}
      </nav>

      {activeLink && (
        <div className="nav-dropdown">

          <div className="nav-dropdown__row">
            {activeLink.links.map((child, i) => (
            <a              
                key={i}
                href={child.url}
                className={activeChild?.url === child.url ? "active" : ""}
                onMouseEnter={() => handleChildEnter(child)}
            >
            {child.title}
            </a>
            ))}
          </div>

          {activeChild && (
            <div className="nav-dropdown__row nav-dropdown__row--sub">
              {activeChild.links.map((grand, i) => (
                <a key={i} href={grand.url}>{grand.title}</a>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
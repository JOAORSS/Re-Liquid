import { useState, useRef } from "react";
import { useShopifyData } from "../../util/ShopifyDataContext";
import type NavLink from "../../types/NavLink.types";
import type { Settings } from "./navbar.types";
import "./navbar.css"

export function Navbar(props: { settings: Settings, mobile?: boolean }) {
  const [activeLink,  setActiveLink]  = useState<NavLink | null>(null);
  const [activeChild, setActiveChild] = useState<NavLink | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const data = useShopifyData();
  const menuLinks: NavLink[] = data.menus[props.settings.menu];

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
    <>
    <MobileNav settings={props.settings} />    
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
    </>
  );
}

function MobileNav({ settings }: { settings: Settings }) {
  const [open, setOpen] = useState(false);
  const data = useShopifyData();
  const menuLinks: NavLink[] = data.menus[settings.menu];

  return (
    <div className="mobile-nav mobile-nav-close">
      <aside className={`mobile-drawer ${open ? "mobile-drawer--open" : ""}`}>
        {menuLinks?.map((link, i) => (
          <MobileNavItem key={i} link={link} />
        ))}
      </aside>
      {open && <div className="mobile-overlay" onClick={() => setOpen(false)} />}
    </div>
  );
}

function MobileNavItem({ link }: { link: NavLink }) {
  const [open, setOpen] = useState(false);
  const hasChildren = link.links?.length > 0;

  return (
    <div className="mobile-nav-item">
      <div className="mobile-nav-item__header">
        <a href={hasChildren ? undefined : link.url}>
          {link.title}
        </a>
        {hasChildren && (
          <button onClick={() => setOpen(o => !o)}>
            <span className={`chevron ${open ? "chevron--up" : ""}`}>›</span>
          </button>
        )}
      </div>

      {hasChildren && open && (
        <div className="mobile-nav-children">
          {link.links.map((child, i) => (
            <MobileNavItem key={i} link={child} />
          ))}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { styled } from "@linaria/react";
import { useShopifyData } from "../../../util/ShopifyDataContext";
import type NavLink from "../../../types/NavLink.types";

interface MobileNavProps {
    menuHandle: string;
    open: boolean;
    onClose: () => void;
}

export function MobileNav({ menuHandle, open, onClose }: MobileNavProps) {
    const data = useShopifyData();
    const menuLinks: NavLink[] = data.menus[menuHandle] ?? [];

    return (
        <>
            <NavAside isOpen={open}>
                <CloseButton onClick={onClose}>✕</CloseButton>
                <NavLinks>
                    {menuLinks.map((link, i) => (
                        <MobileNavItem key={i} link={link} />
                    ))}
                </NavLinks>
            </NavAside>
            {open && <NavOverlay onClick={onClose} />}
        </>
    );
}

function MobileNavItem({ link }: { link: NavLink }) {
    const [open, setOpen] = useState(false);
    const hasChildren = link.links?.length > 0;

    return (
        <ItemWrapper>
            <ItemRow>
                <ItemLink fullWidth={hasChildren ? '50%' : '100%'} href={link.url}>
                    {link.title}
                </ItemLink>
                {hasChildren && (
                    <ChevronButton
                        isOpen={open}
                        onClick={() => setOpen((o) => !o)}
                    >
                        <span>›</span>
                    </ChevronButton>
                )}
            </ItemRow>
            {hasChildren && open && (
                <ChildrenWrapper>
                    {link.links.map((child, i) => (
                        <MobileNavItem key={i} link={child} />
                    ))}
                </ChildrenWrapper>
            )}
        </ItemWrapper>
    );
}

const NavAside = styled.aside<{ isOpen: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    width: 80%;
    max-width: 320px;
    height: 100vh;
    background: #fff;
    z-index: 12000;
    transform: translateX(${(props) => (props.isOpen ? "0" : "-100%")});
    transition: transform 0.3s ease-in-out;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
`;

const NavOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 11999;
`;

const CloseButton = styled.button`
    align-self: flex-end;
    padding: 16px 20px;
    background: none;
    border: none;
    font-size: 18px;
    color: var(--dark);
    cursor: pointer;
`;

const NavLinks = styled.nav`
    padding: 0 20px 40px;
    display: flex;
    flex-direction: column;
`;

const ItemWrapper = styled.div`
    border-bottom: 1px solid var(--border);
`;

const ItemRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0;
`;

const ItemLink = styled.a<{ fullWidth: string }>`
    font-family: var(--font-body);
    font-size: 13px;
    padding: 14px 0;    
    font-weight: 600;
    width: ${(props) => props.fullWidth};
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--dark);
    text-decoration: none;
`;

const ChevronButton = styled.button<{ isOpen: boolean }>`
    background: none;
    border: none;
    display: flex;
    justify-content: flex-end;
    width: 50%;
    font-size: 18px;
    padding: 14px 0;
    padding-right: 10px;
    color: var(--grey);
    cursor: pointer;
    align-self: flex-end;
    line-height: 1;

    span {
        transition: transform 0.2s;
        transform: ${(props) => (props.isOpen ? "rotate(90deg)" : "none")};
    }
`;

const ChildrenWrapper = styled.div`
    padding-left: 16px;
    border-left: 2px solid var(--plum-light);
    margin-bottom: 8px;

    /* Estilização aninhada substituindo o antigo .m-nav-item__children .m-nav-item */
    ${ItemWrapper} {
        border-bottom: none;
    }

    ${ItemLink} {
        font-size: 11px;
        color: var(--grey);
    }
`;
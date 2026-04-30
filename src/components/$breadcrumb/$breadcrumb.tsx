import { styled } from "@linaria/react";
import { injectLiquidRaw } from "../../util/shopify";

interface BreadcrumbItem {
    label: string;
    url?: string;
}

const canShow = injectLiquidRaw<boolean>(`{% if template.name == 'index' or template.name == 'search' or template.name == '404' %}false{% else %}true{% endif %}`);

const breadcrumbItems = injectLiquidRaw<BreadcrumbItem[]>(`
    [
        { "label": "Home", "url": "/" }
        {%- if template.name == 'product' -%}
            {%- if collection -%}
                , { "label": {{ collection.title | json }}, "url": {{ collection.url | json }} }
            {%- endif -%}
            , { "label": {{ product.title | json }} }
        {%- elsif template.name == 'collection' and collection.handle -%}
            , { "label": {{ collection.title | json }} }
        {%- elsif template.name == 'page' -%}
            , { "label": {{ page.title | json }} }
        {%- elsif template.name == 'blog' -%}
            , { "label": {{ blog.title | json }} }
        {%- elsif template.name == 'article' -%}
            , { "label": {{ blog.title | json }}, "url": {{ blog.url | json }} }
            , { "label": {{ article.title | json }} }
        {%- endif -%}
    ]
`);

console.log(canShow);
console.log(breadcrumbItems);
export default function Breadcrumb() {

    return (
        canShow ? (
            <Nav className="shopify-section">
                {breadcrumbItems && breadcrumbItems.map((item, i) => {
                    const isLast = i === breadcrumbItems.length - 1;
                    return (
                        <span key={i}>
                        {isLast || !item.url
                            ? <Current>{item.label}</Current>
                            : <Link href={item.url}>{item.label}</Link>
                        }
                        {!isLast && <Sep>›</Sep>}
                    </span>
                );
            })}
        </Nav>
        ) : <></>
    );
}

const Nav = styled.nav`
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    max-width: var(--content-width);
    margin: 14px auto 14px;
`;

const Link = styled.a`
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.5px;
    color: var(--grey);
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
        color: var(--dark);
    }
`;

const Current = styled.span`
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.5px;
    color: var(--dark);
`;

const Sep = styled.span`
    font-size: 11px;
    color: var(--grey);
    padding-left: 6px;
    opacity: 0.5;
`;
import { injectLiquidRaw } from '../../util/shopify';

const menus = injectLiquidRaw<any>(`
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

const collection = injectLiquidRaw<any>(`
  {%- if request.page_type == 'collection' -%}
    {%- paginate collection.products by 250 -%}
    {
      "title": {{ collection.title | json }},
      "products": [
        {%- for product in collection.products -%}
          {
            "id": {{ product.id | json }},
            "title": {{ product.title | json }},
            "url": {{ product.url | json }},
            "price": {{ product.price | money_without_currency | json }},
            "compare_at_price": {{ product.compare_at_price | json }},
            "tags": {{ product.tags | json }},
            "image": {{ product.images[0] | json }},
            "imageHover": {{ product.images[1] | json }},
            "description": {{ product.description | strip_html | truncate: 100 | json }},
            "collections": [{%- for c in product.collections -%}{{ c.handle | json }}{%- unless forloop.last -%},{%- endunless -%}{%- endfor -%}],
            "quantity": {{ product.variants | map: 'inventory_quantity' | sum | json }}
          }
          {%- unless forloop.last -%},{%- endunless -%}
        {%- endfor -%}
      ]
    }
    {%- endpaginate -%}
  {%- else -%}
  null
  {%- endif -%}
`);

window.__shopifyData__ = { menus, collection };

export function Context() { return null; }

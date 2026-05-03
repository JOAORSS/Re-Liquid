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
            "description": {% assign normalized_desc = product.description | replace: '<b>', '<strong>' | replace: '</b>', '</strong>' %}
                            {%- if normalized_desc contains '<strong>' -%}
                                {%- assign split_by_open = normalized_desc | split: '<strong>' -%}
                                {%- assign last_bold_section = split_by_open | last -%}
                                {%- assign split_by_close = last_bold_section | split: '</strong>' -%}
                                {%- assign final_bold_text = split_by_close | first | strip_html | strip -%}
                                {{ final_bold_text | json }}
                            {%- else -%}
                                {{ product.description | strip_html | truncate: 100 | json }}
                            {%- endif -%},
            "collections": [{%- for c in product.collections -%}{{ c.handle | json }}{%- unless forloop.last -%},{%- endunless -%}{%- endfor -%}],
            "quantity": {{ product.variants | map: 'inventory_quantity' | sum | json }},
            "stone": [{% assign all_tags = product.tags | join: ' ' %}
                      {% assign search_pool = product.title | append: ' ' | append: product.description | append: ' ' | append: all_tags | downcase %}
                      {% assign stones_string = "African Bloodstone,African Turquoise,Agate,African Blood,Amazonite,Amber,Amethyst,Angelite,Apatite,Apophyllite,Aquamarine,Aragonite,Aura quartz,Aventurine,Azurite,Black Kyanite,Black Tourmaline,Bloodstone,Blue Aragonite,Blue Lace Agate,Blue Calcite,Blue Quartz,Blue Goldstone,Blue Tourmaline,Calcite,Caribbean Blue Calcite,Fire Quartz,Flower Agate,Fluorite,Fuchsite,Garnet,Golden Healer Quartz,Golden Obsidian,Grape Agate,Green Jade,Green Fluorite,Green Tourmaline,Green Jasper,Halite,Hematite,Howlite,Iolite,Jasper,Kyanite,Labradorite,Lapis Lazuli,Larimar,Lava Stone,Lemon Calcite,Lepidolite,Mahogany Obsidian,Malachite,Mica,Moldavite,Mookaite,Moonstone,oss Agate,bsidian,Ocean Jasper,Opal,Opalite,Orchid calcite,Peach Moonstone,Peach Selenite,Peacock,Pearl,Peridot,Pink Amethyst,Pink Opal,Pink Tourmaline,Picasso Jasper,Pistachio Calcite,Polychrome Jasper,Prehnite,Pyrite,hodochrosite,Rhodonite,Red Vein Jasper,Rose Calcite,Rose Quartz,Root Fluorite,Rutilated quartz,Ruby,Ruby Fuschite,Ruby Kyanite,uby Zoisite,Selenite,Serpentine,Shungite,Smoky Quartz,Sodalite,Strawberry Quartz,unstone,Silver Sheen Obsidian,Tangerine Quartz,Tigers Eye,Tourmalinated Quartz,Turquoise,Unakite,Vanadinite,White Agate,Yellow Calcite,Yellow Jasper" %}
                      {% assign stones_array = stones_string | split: ',' %}
                      {%- assign first_item = true -%}
                      {%- for stone in stones_array -%}
                         {%- assign stone_down = stone | downcase | strip -%}
                         {%- if search_pool contains stone_down -%}
                            {%- unless first_item -%},{%- endunless -%}
                            "{{ stone | strip }}"
                            {%- assign first_item = false -%}
                         {%- endif -%}
                      {%- endfor -%}]
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

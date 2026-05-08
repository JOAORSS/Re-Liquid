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
            "stone": [{%- assign all_tags = product.tags | join: ' ' -%}
                      {%- assign search_pool = product.title | append: ' ' | append: product.description | append: ' ' | append: all_tags | downcase -%}
                      {%- assign stones_string = "African Bloodstone,African Turquoise,Agate,African Blood,Amazonite,Amber,Amethyst,Angelite,Apatite,Apophyllite,Aquamarine,Aragonite,Aura quartz,Aventurine,Azurite,Black Kyanite,Black Tourmaline,Bloodstone,Blue Aragonite,Blue Lace Agate,Blue Calcite,Blue Quartz,Blue Goldstone,Blue Tourmaline,Calcite,Caribbean Blue Calcite,Fire Quartz,Flower Agate,Fluorite,Fuchsite,Garnet,Golden Healer Quartz,Golden Obsidian,Grape Agate,Green Jade,Green Fluorite,Green Tourmaline,Green Jasper,Halite,Hematite,Howlite,Iolite,Jasper,Kyanite,Labradorite,Lapis Lazuli,Larimar,Lava Stone,Lemon Calcite,Lepidolite,Mahogany Obsidian,Malachite,Mica,Moldavite,Mookaite,Moonstone,Moss Agate,Obsidian,Ocean Jasper,Opal,Opalite,Orchid calcite,Peach Moonstone,Peach Selenite,Peacock,Pearl,Peridot,Pink Amethyst,Pink Opal,Pink Tourmaline,Picasso Jasper,Pistachio Calcite,Polychrome Jasper,Prehnite,Pyrite,Rhodochrosite,Rhodonite,Red Vein Jasper,Rose Calcite,Rose Quartz,Root Fluorite,Rutilated quartz,Ruby,Ruby Fuschite,Ruby Kyanite,Ruby Zoisite,Selenite,Serpentine,Shungite,Smoky Quartz,Sodalite,Strawberry Quartz,Sunstone,Silver Sheen Obsidian,Tangerine Quartz,Tigers Eye,Tourmalinated Quartz,Turquoise,Unakite,Vanadinite,White Agate,Yellow Calcite,Yellow Jasper,Carnelian,Celestine,Chevron Amethyst,Chrysocolla,Chrysoprase,Citrine,Clear Quartz,Dalmatian Jasper,Desert Rose,Dragon’s Blood Jasper,Emerald" -%}
                      {%- assign stones_array = stones_string | split: ',' -%}

                      {%- assign matched_string = "" -%}
                      {%- for stone in stones_array -%}
                          {%- assign stone_down = stone | downcase | strip -%}
                          {%- if search_pool contains stone_down -%}
                              {%- assign matched_string = matched_string | append: stone | strip | append: "|||" -%}
                          {%- endif -%}
                      {%- endfor -%}

                      {%- assign matched_array = matched_string | split: "|||" -%}
                      {%- assign final_matches = "" -%}

                      {%- for stone_a in matched_array -%}
                          {%- assign stone_a_down = stone_a | downcase | strip -%}
                          {%- assign is_substring = false -%}
                          
                          {%- for stone_b in matched_array -%}
                              {%- assign stone_b_down = stone_b | downcase | strip -%}
                              {%- if stone_a_down != stone_b_down and stone_b_down contains stone_a_down -%}
                                  {%- assign is_substring = true -%}
                                  {%- break -%}
                              {%- endif -%}
                          {%- endfor -%}
                          
                          {%- if is_substring == false -%}
                              {%- assign final_matches = final_matches | append: stone_a | strip | append: "|||" -%}
                          {%- endif -%}
                      {%- endfor -%}

                      {%- assign final_matches_array = final_matches | split: "|||" -%}
                      
                      {%- for match in final_matches_array -%}
                          "{{ match }}"{%- unless forloop.last -%},{%- endunless -%}
                      {%- endfor -%}
                  ]
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

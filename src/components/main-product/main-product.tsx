import type { TProduct } from "../../types/store.types";
import { injectLiquidRaw } from "../../util/shopify";
import PhotoGallery from "./_photo-gallery";
import { ProductInfo } from "./_product-detail";
import "./main-product.css";

export function MainProduct(props: { settings: Settings }) {

    const product = injectLiquidRaw<TProduct>(`
    {%- if product -%}
        {
        "available": {{ product.available | json }},
        "category": null,
        "collections": [
            {%- for collection in product.collections -%}
            {
                "id": {{ collection.id | json }},
                "handle": {{ collection.handle | json }},
                "title": {{ collection.title | json }},
                "url": {{ collection.url | json }}
            }{%- unless forloop.last -%},{%- endunless -%}
            {%- endfor -%}],
        "compare_at_price": {{ product.compare_at_price | json }},
        "compare_at_price_max": {{ product.compare_at_price_max | json }},
        "compare_at_price_min": {{ product.compare_at_price_min | json }},
        "compare_at_price_varies": {{ product.compare_at_price_varies | json }},
        "content": {{ product.content | json }},
        "created_at": {{ product.created_at | json }},
        "description": {{ product.description | json }},
        "featured_image": {{ product.featured_image | json }},
        "featured_media": {{ product.featured_media | json }},
        "first_available_variant": {{ product.first_available_variant | json }},
        "gift_card": {{ product.gift_card | json }},
        "handle": {{ product.handle | json }},
        "has_only_default_variant": {{ product.has_only_default_variant | json }},
        "id": {{ product.id | json }},
        "images": {{ product.images | json }},
        "media": {{ product.media | json }},
        "metafields": {},
        "options": {{ product.options | json }},
        "options_by_name": {},
        "options_with_values": [
            {%- for option in product.options_with_values -%}
            {
                "name": {{ option.name | json }},
                "position": {{ option.position | json }},
                "values": {{ option.values | json }},
                "selected_value": {{ option.selected_value | json }}
            }{%- unless forloop.last -%},{%- endunless -%}
            {%- endfor -%}],
        "price": {{ product.price | json }},
        "price_max": {{ product.price_max | json }},
        "price_min": {{ product.price_min | json }},
        "price_varies": {{ product.price_varies | json }},
        "published_at": {{ product.published_at | json }},
        "quantity_price_breaks_configured": false,
        "requires_selling_plan": {{ product.requires_selling_plan | json }},
        "selected_or_first_available_selling_plan_allocation": {{ product.selected_or_first_available_selling_plan_allocation | json }},
        "selected_or_first_available_variant": {{ product.selected_or_first_available_variant | json }},
        "selected_selling_plan": {{ product.selected_selling_plan | json }},
        "selected_selling_plan_allocation": {{ product.selected_selling_plan_allocation | json }},
        "selected_variant": {{ product.selected_variant | json }},
        "selling_plan_groups": {{ product.selling_plan_groups | json }},
        "tags": {{ product.tags | json }},
        "template_suffix": {{ product.template_suffix | json }},
        "title": {{ product.title | json }},
        "type": {{ product.type | json }},
        "url": {{ product.url | json }},
        "variants": {{ product.variants | json }},
        "variants_count": {{ product.variants_count | json }},
        "vendor": {{ product.vendor | json }}
        }
    {%- else -%}
        {}
    {%- endif -%}
    `);

    return (
        <div>
            <PhotoGallery />
            <ProductInfo  />
        </div>
    );
}
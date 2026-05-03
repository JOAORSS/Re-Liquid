import type { TProduct } from "../../types/store.types";
import { calculateProductRating, injectLiquid, injectLiquidRaw } from "../../util/shopify";
import PhotoGallery from "./_photo-gallery";
import { ProductInfo } from "./_product-detail";
import "./main-product.css";
import type { Settings } from "./main-product.types";

export function MainProduct(props: { settings: Settings }) {
    props;

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
        "price": {{ product.price | money_without_currency | json }},
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

    const images = product.media.filter((item: any) => {
        if (item.media_type === "image") return true;
        if (item.media_type === "video") return true;
    }).map((item: any) => item.src);

    const Badge = product.collections[0].title;
    
    const benefits = [
        {
            icon: props.settings.benefits_svg_1,
            label: props.settings.benefits_label_1
        },
        {
            icon: props.settings.benefits_svg_2,
            label: props.settings.benefits_label_2
        },
        {
            icon: props.settings.benefits_svg_3,
            label: props.settings.benefits_label_3
        }
    ].filter(benefit => benefit.icon);

    const { rating, reviewCount } = calculateProductRating(product.id);

    const code = injectLiquid<string>(`cart.currency.iso_code | json`);
    const sym = injectLiquid<string>(`cart.currency.symbol | json`);

    const stone = injectLiquidRaw<string[]>(`
        {% assign all_tags = product.tags | join: ' ' %}
        {% assign search_pool = product.title | append: ' ' | append: product.description | append: ' ' | append: all_tags | downcase %}

        {% assign stones_string = "African Bloodstone,African Turquoise,Agate,African Blood,Amazonite,Amber,Amethyst,Angelite,Apatite,Apophyllite,Aquamarine,Aragonite,Aura quartz,Aventurine,Azurite,Black Kyanite,Black Tourmaline,Bloodstone,Blue Aragonite,Blue Lace Agate,Blue Calcite,Blue Quartz,Blue Goldstone,Blue Tourmaline,Calcite,Caribbean Blue Calcite,Fire Quartz,Flower Agate,Fluorite,Fuchsite,Garnet,Golden Healer Quartz,Golden Obsidian,Grape Agate,Green Jade,Green Fluorite,Green Tourmaline,Green Jasper,Halite,Hematite,Howlite,Iolite,Jasper,Kyanite,Labradorite,Lapis Lazuli,Larimar,Lava Stone,Lemon Calcite,Lepidolite,Mahogany Obsidian,Malachite,Mica,Moldavite,Mookaite,Moonstone,oss Agate,bsidian,Ocean Jasper,Opal,Opalite,Orchid calcite,Peach Moonstone,Peach Selenite,Peacock,Pearl,Peridot,Pink Amethyst,Pink Opal,Pink Tourmaline,Picasso Jasper,Pistachio Calcite,Polychrome Jasper,Prehnite,Pyrite,hodochrosite,Rhodonite,Red Vein Jasper,Rose Calcite,Rose Quartz,Root Fluorite,Rutilated quartz,Ruby,Ruby Fuschite,Ruby Kyanite,uby Zoisite,Selenite,Serpentine,Shungite,Smoky Quartz,Sodalite,Strawberry Quartz,unstone,Silver Sheen Obsidian,Tangerine Quartz,Tigers Eye,Tourmalinated Quartz,Turquoise,Unakite,Vanadinite,White Agate,Yellow Calcite,Yellow Jasper,Carnelian,Celestine,Chevron Amethyst,Chrysocolla,Chrysoprase,Citrine,Clear Quartz,Dalmatian Jasper,Desert Rose,Dragon’s Blood Jasper,Emerald" %}
        {% assign stones_array = stones_string | split: ',' %}

        [
        {%- assign first_item = true -%}
        {%- for stone in stones_array -%}
            {%- assign stone_down = stone | downcase | strip -%}
            {%- if search_pool contains stone_down -%}
                {%- unless first_item -%},{%- endunless -%}
                "{{ stone | strip }}"
                {%- assign first_item = false -%}
            {%- endif -%}
        {%- endfor -%}
        ]
    `);

    const subtitleText = injectLiquidRaw<string>(`
        {% assign normalized_desc = product.description | replace: '<b>', '<strong>' | replace: '</b>', '</strong>' %}

        {% if normalized_desc contains '<strong>' %}
            {% assign split_by_open = normalized_desc | split: '<strong>' %}
            {% assign last_bold_section = split_by_open | last %}
            
            {% assign split_by_close = last_bold_section | split: '</strong>' %}
            {% assign final_bold_text = split_by_close | first | strip_html | strip %}
            
            "{{ final_bold_text }}"
        {% else %}
            "{{ product.tags | join: ' ✶ ' }}"
        {% endif %}
    `);

    function getStoneLink(stone: string): string {
        if (!stone) return "/pages/discovercrystals";

        const initial = stone.charAt(0).toUpperCase();

        if (initial >= 'A' && initial <= 'B') {
            return "/pages/discovercrystals";
        } else if (initial >= 'C' && initial <= 'E') {
            return "/pages/crystals-c-e-1";
        } else if (initial >= 'F' && initial <= 'J') {
            return "/pages/crystals-f-j";
        } else if (initial >= 'K' && initial <= 'P') {
            return "/pages/crystals-k-p";
        } else if (initial >= 'Q' && initial <= 'Z') {
            return "/pages/discover-q-z";
        }

        return "/pages/crystal-care";
    };

    const stoneTrigger = {
        targetId: getStoneLink(stone[0]),
        title: stone[0],
        subtitle: "Discover the properties of this crystal" 
    };
    
    return (
        <div className="product-container">
            <PhotoGallery images={images} alt={product.title} />
            
            <ProductInfo  
                title={product.title}
                description={product.description}
                price={product.price}
                compareAtPrice={product.compare_at_price ? product.compare_at_price : undefined}
                
                cashback={props.settings.cashback_text}
                couponCode={props.settings.coupon_code}
                couponLabel={props.settings.coupon_label}
                shipping={props.settings.shipping_text}
                descriptionTitle={props.settings.description_title}

                stoneTrigger={stoneTrigger}
                subtitle={subtitleText}
                stars={rating}
                rating={rating}
                reviewCount={reviewCount}
                benefits={benefits}
                badge={Badge}
                code={code}
                sym={sym}
            />
        </div>
    );
}
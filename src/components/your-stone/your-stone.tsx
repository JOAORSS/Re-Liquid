import ShowcaseContainer from "../_showcase-container";
import Gallery from "../_gallery";
import type { Settings } from "./your-stone.types";
import { useState } from "react";
import "./your-stone.css";
import { ProductCard } from "../_product-card";
import { injectLiquidRaw } from "../../util/shopify";
import type { TBasicProduct } from "../../types/store.types";

export function YourStone(props: { settings: Settings }) {

    const STONE_SLOTS = 5;
    const stones = Array.from({ length: STONE_SLOTS }, (_, i) => {
        const index = i + 1;
        return {
            name: props.settings[`title_${index}` as keyof Settings] as string,
            image: props.settings[`image_${index}` as keyof Settings] as string,
            url: props.settings[`view_all_link_${index}` as keyof Settings] as string,
        };
    }).filter(s => s.name && s.image);

    const [currentStone, setCurrentStone] = useState<string>(stones[0]?.name ?? "");

    const rawProducts = injectLiquidRaw<TBasicProduct[]>(`
        [   
            {%- paginate collections['all'].products by 200 -%}
                {%- for product in collections['all'].products -%}
                    {
                        "id": {{ product.id | json }},
                        "title": {{ product.title | json }},
                        "url": {{ product.url | json }},
                        "price": {{ product.price | money_without_currency | json }},
                        "compare_at_price": {{ product.compare_at_price | json }},
                        "tags": {{ product.tags | json }},
                        "image": {{ product.images[0] | json }},
                        "imageHover": {{ product.images[1] | json }},
                        "description": {{ product.description | strip_html | truncate: 100 | json }}
                    }
                    {%- if forloop.last == false -%},{%- endif -%}
                {%- endfor -%}
            {%- endpaginate -%}
        ]        
    `);

    const filteredProducts = rawProducts.filter(
                                    (product) => product.tags.some((tag: string) => tag.toLowerCase() === currentStone.toLowerCase())
                                ).slice(0, 4);    

    const FilterChildren = (
        <div className="filter">
            {stones.map((stone) => (
                stone.image && stone.name && (
                    <button className="crystal-select" key={stone.name} onClick={() => setCurrentStone(stone.name)}>
                        <img src={stone.image} alt={stone.name} />
                        <p>{stone.name}</p>
                    </button>
                )
            ))}
        </div>
    );

    return (
        <ShowcaseContainer 
            orientation="row" 
            name={props.settings.name} 
            title={props.settings.title} 
            subtitle={props.settings.subtitle}
            showMore={{text: props.settings.view_all, url: stones.find(s => s.name === currentStone)?.url || "#"}}
            filterChildren={FilterChildren}
            mobileMode="column"
        >
            <div className="your-stone">
                <Gallery>
                    {filteredProducts.map((product) => (
                        <ProductCard
                            id={product.id}
                            key={product.id}
                            name={product.title}
                            stone={product.tags[0]}
                            image={product.image}
                            imageHover={product.imageHover}
                            badge={product.tags[0]}
                            subTitle={product.description}
                            price={product.price}
                            url={product.url}
                        />
                    ))}
                </Gallery>
            </div>
        </ShowcaseContainer>
    );
}
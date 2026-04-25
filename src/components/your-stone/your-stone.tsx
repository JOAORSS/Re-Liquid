import ShowcaseContainer from "../_showcase-container";
import Gallery from "../_gallery";
import type { Settings } from "./your-stone.types";
import { useState } from "react";
import "./your-stone.css";
import { ProductCard } from "../_product-card";
import { injectLiquidRaw } from "../../util/shopify";
import type { TBasicProduct } from "../../util/store.types";

export function YourStone(props: { settings: Settings }) {

    const stones = [
        {
            name: props.settings.title_1,
            image: props.settings.image_1
        },
        {
            name: props.settings.title_2,
            image: props.settings.image_2
        },
        {
            name: props.settings.title_3,
            image: props.settings.image_3
        },
        {
            name: props.settings.title_4,
            image: props.settings.image_4
        },
        {
            name: props.settings.title_5,
            image: props.settings.image_5
        }
    ];

    const [currentStone, setCurrentStone] = useState<string>(props.settings.title_1);

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
            showMore={{text: props.settings.view_all, url: props.settings.view_all_link}}
            filterChildren={FilterChildren}
        >
            <div className="your-stone">
                <Gallery>
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            name={product.title}
                            stone={product.tags[0]}
                            image={product.image}
                            imageHover={product.imageHover}
                            badge={product.tags[0]}
                            subTitle={product.description}
                            stars={3}
                            rate={4.5}
                            viwes={100}
                            price={product.price}
                        />
                    ))}
                </Gallery>
            </div>
        </ShowcaseContainer>
    );
}
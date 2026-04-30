import { CollectionHeader } from "../_filter-header";
import FilterSidebar from "../_filter-sidebar";
import { FilterProvider, useFilter } from "../_filter-sidebar/Provider";
import Gallery from "../_gallery";
import { ProductCard } from "../_product-card";
import type { Settings } from "./main-collection.types";
import "./main-collection.css";

export function Collection(props: { settings: Settings }) {
    const products = window.__shopifyData__.collection?.products ?? [];
    const title = window.__shopifyData__.collection?.title ?? "";

    const stoneOptions = Array.from({ length: 5 }, (_, i) => {
        const n = i + 1;
        return {
            stone: props.settings[`title_${n}` as keyof Settings] as string,
            image: props.settings[`image_${n}` as keyof Settings] as string,
        };
    }).filter(s => s.stone && s.image);

    return (
        <FilterProvider products={products}>
            <CollectionHeader title={title} />
            <div className="collection-layout">
                <FilterSidebar stoneOptions={stoneOptions} />
                <CollectionGallery />
            </div>
        </FilterProvider>
    );
}

function CollectionGallery() {
    const { filteredProducts } = useFilter();
    return (
        <Gallery columns={3}>
            {filteredProducts.map((product, i) => (
                <ProductCard
                    key={`${product.id}-${i}`}
                    name={product.title}
                    stone={product.tags[0]}
                    stockTag={product.quantity === 0 ? "fora de estoque" : 
                                product.quantity <= 3 ? `${product.quantity} em estoque` : ""}
                    image={product.image}
                    imageHover={product.imageHover}
                    subTitle={product.description}
                    stars={3}
                    rate={4.5}
                    viwes={100}
                    price={product.price}
                    url={product.url}
                />
            ))}
        </Gallery>
    );
}
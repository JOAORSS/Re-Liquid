import { CollectionHeader } from "../_filter-header";
import FilterSidebar from "./_filter-sidebar";
import { FilterProvider, useFilter } from "./_filter-sidebar/Provider";
import Gallery from "../_gallery";
import { ProductCard } from "../_product-card";
import type { Settings } from "./main-collection.types";
import "./main-collection.css";

export function Collection(props: { settings: Settings }) {
    props;
    const products = window.__shopifyData__.collection?.products ?? [];
    const title = window.__shopifyData__.collection?.title ?? "";


    return (
        <FilterProvider products={products}>
            <CollectionHeader title={title} />
            <div className="collection-layout">
                <FilterSidebar />
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
                    id={product.id}
                    name={product.title}
                    stone={product.tags[0]}
                    stockTag={product.quantity === 0 ? "Out of Stock" : product.quantity <= 3 ? `Only ${product.quantity} left` : ""}
                    image={product.image}
                    imageHover={product.imageHover}
                    subTitle={product.description}
                    price={product.price}
                    url={product.url}
                />
            ))}
        </Gallery>
    );
}
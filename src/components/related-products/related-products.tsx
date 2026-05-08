import type { TBasicProduct, TShowcaseGallery } from "../../types/store.types";
import { ProductCard } from "../_product-card";
import ShowcaseContainer from "../_showcase-container";

export function RelatedProducts() {
    const dataElement = document.getElementById('shared-related-products-data');
    
    if (!dataElement || !dataElement.textContent) {
        return null;
    }

    const showcaseData = JSON.parse(dataElement.textContent) as [TShowcaseGallery, TShowcaseGallery];
    const [crystalProducts, collectionProducts] = showcaseData;
    
    return (
        <>
            {crystalProducts.products && crystalProducts.products.length > 0 && (
                <GalleryProduct showcase={crystalProducts} />
            )}
            
            {collectionProducts.products && collectionProducts.products.length > 0 && (
                <GalleryProduct showcase={collectionProducts} />
            )}
        </>
    );
}

function GalleryProduct({
    showcase,
}: {
    showcase: TShowcaseGallery;
}) {
    
    return (
        <ShowcaseContainer
            title={showcase.title}
            fullContainer={"var(--content-width)"}
            orientation="row"
            mobileMode="overflow"
            backgroundColor="#fff0"
        >
            <div className="hashtag-container">
                {showcase.products.map((product: TBasicProduct, i: number) => (
                    <ProductCard 
                        tamMin="238px"
                        key={`${product.id}-${i}`}
                        id={product.id}
                        name={product.title}
                        image={product.image}
                        imageHover={product.imageHover}
                        price={product.price}
                        url={product.url}
                />
                ))}
            </div>
        </ShowcaseContainer>
    );
}
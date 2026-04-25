import ShowcaseContainer from "../_showcase-container";
import "./community.css";
import type { Settings } from "./community.types";

export function Community(props: { settings: Settings }) {

    const reviews = [
        {
            name: props.settings.name_1,
            image: props.settings.image_1,
            address: props.settings.address_1,
            stars: props.settings.stars_1,
            review: props.settings.review_1
        },
        {
            name: props.settings.name_2,
            image: props.settings.image_2,
            address: props.settings.address_2,
            stars: props.settings.stars_2,
            review: props.settings.review_2
        },
        {
            name: props.settings.name_3,
            image: props.settings.image_3,
            address: props.settings.address_3,
            stars: props.settings.stars_3,
            review: props.settings.review_3
        },
        {
            name: props.settings.name_4,
            image: props.settings.image_4,
            address: props.settings.address_4,
            stars: props.settings.stars_4,
            review: props.settings.review_4
        }
    ];

    return (
        <ShowcaseContainer
            name={props.settings.name}
            title={props.settings.title}
            backgroundColor={props.settings.background_color}
            orientation="row"
            mobileMode="overflow" 
            fullContainer="var(--content-width)"
        >
            {reviews.map((review) => (
                review.image && review.name && review.address && review.stars && review.review && (
                    <CommunityCard
                        image={review.image}
                        name={review.name}
                        address={review.address}
                        stars={review.stars}
                        review={review.review}
                    />
                )
            ))}
        </ShowcaseContainer>
    );
}

interface TCommunityCard {
    image: string;
    name: string;
    address: string;
    stars: number;
    review: string;
}

function CommunityCard({ image, name, address, stars, review }: TCommunityCard) {
    return (
        <div className="card">
            <img src={image} alt={name} />
            <div className="body">
                <div className="author">
                    <div className="avatar">{name[0]}</div>
                    <div>
                        <div className="name">{name}</div>
                        <div className="address">{address}</div>
                    </div>
                </div>
                <div className="stars">{"★".repeat(stars)}</div>
                <p className="review">{review}</p>
            </div>
        </div>
    );
}
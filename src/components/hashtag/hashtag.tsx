import ShowcaseContainer from "../_showcase-container";
import "./hashtag.css";
import type { Settings } from "./hashtag.types";

export function Hashtag(props: { settings: Settings }) {

    const locations = [
        {
            link: props.settings.link_1,
            image: props.settings.image_1,
        },
        {
            link: props.settings.link_2,
            image: props.settings.image_2,
        },
        {
            link: props.settings.link_3,
            image: props.settings.image_3,
        },
        {
            link: props.settings.link_4,
            image: props.settings.image_4,
        },
        {
            link: props.settings.link_5,
            image: props.settings.image_5,
        },
        {
            link: props.settings.link_6,
            image: props.settings.image_6,
        }
    ];

    return (
        <ShowcaseContainer
            fullContainer={props.settings.background_color !== "#ffffff" ? "var(--content-width)" : "100%"}
            name={props.settings.name}
            title={props.settings.title}
            subtitle={props.settings.subtitle}
            orientation="row"
            backgroundColor={props.settings.background_color}
        >
            <div className="hashtag-container">
                {locations.map((location) => (
                    location.image && location.link && (
                        <a href={location.link} className="hashtag-link">
                            <img src={location.image} alt={location.link} className="hashtag-image" />
                            <span className="hashtag-plus">+</span>
                        </a>
                    )
                ))}
            </div>
        </ShowcaseContainer>
    );
}
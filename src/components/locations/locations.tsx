import ShowcaseContainer from "../_showcase-container";
import "./locations.css";
import type { Settings } from "./locations.types";

export function Locations(props: { settings: Settings }) {

    const locations = [
        {
            name: props.settings.name_1,
            image: props.settings.image_1,
            address: props.settings.address_1
        },
        {
            name: props.settings.name_2,
            image: props.settings.image_2,
            address: props.settings.address_2
        },
        {
            name: props.settings.name_3,
            image: props.settings.image_3,
            address: props.settings.address_3
        }
    ];

    return (
        <ShowcaseContainer
            glyph={props.settings.glyph}
            name={props.settings.name}
            title={props.settings.title}
            subtitle={props.settings.subtitle}
            backgroundColor={props.settings.background_color}
            orientation="row"
            mobileMode="column"
        >
            {locations.map((location) => (
                location.image && location.name && (
                    <div className="location" key={location.name}>
                        <img className="image" src={location.image} alt={location.name} />
                        <p className="name">{location.name} <span className="name_store" >STORE</span></p>
                        <p className="address">{location.address}</p>
                    </div>
                )
            ))}
        </ShowcaseContainer>
    );
}
import type { Settings } from "./announcement.types";

export function Announcement(props: { settings: Settings }) {
    return (
        <>
            {props.settings.link != "" 
                ? <a className="item" href={props.settings.link || "#"}>{props.settings.label}</a> 
                : <span className="item">{props.settings.label}</span>}
        </>
    );
}
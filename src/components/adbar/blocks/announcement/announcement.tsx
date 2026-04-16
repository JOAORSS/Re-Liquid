export function Announcement(props: { settings: any }) {
    return (
        <>
            {props.settings.link != "" 
                ? <a className="item" href={props.settings.link || "#"}>{props.settings.label}</a> 
                : <span className="item">{props.settings.label}</span>}
        </>
    );
}
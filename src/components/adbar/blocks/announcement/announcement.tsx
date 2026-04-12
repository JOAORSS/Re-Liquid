export function Announcement(props: { settings: any }) {
    return (
        <a className="item" href={props.settings.link || "#"}>
            {props.settings.label}
        </a>
    );
}
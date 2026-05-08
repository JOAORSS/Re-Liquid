import type { Settings } from "./announcement.types";

export function Announcement({ block }: { block: Settings }) {
    return (
        <>
            {block.settings.link != "" 
                ? <a className="item" href={block.settings.link || "#"}>{block.settings.label}</a> 
                : <span className="item">{block.settings.label}</span>}
        </>
    );
}
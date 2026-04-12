import { Announcement } from "./blocks/announcement/announcement";
import "./adbar.css";

declare global {
    interface Window {
        adbar: typeof Adbar;
    }
}

export function Adbar(props: any) {
    if (!props.blocks || props.blocks.length === 0) return null;

    const renderBlock = (block: any) => {
        if (block.type == 'announcement') return <Announcement key={block.id} settings={block.settings} />;
        else return null;
    };

    return (
        <div className="adbar">
            <div className="track">
                {props.blocks.map(renderBlock)}
                
                {props.blocks.map((block: any) => (
                    <Announcement key={`dup-${block.id}`} settings={block.settings} />
                ))}
            </div>
        </div>
    );
}

(window as any)['adbar'] = Adbar;
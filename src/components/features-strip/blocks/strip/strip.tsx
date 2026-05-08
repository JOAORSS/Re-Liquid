import type { Settings } from "./strip.types";

export function Strip({ block }: {block: Settings }) {
    return (
        <div className="feat-item">
            <div dangerouslySetInnerHTML={{ __html: block.settings.svg_html }} />
            <strong>{block.settings.title}</strong>
            <span>{block.settings.subtitle}</span>
        </div>
    );
}
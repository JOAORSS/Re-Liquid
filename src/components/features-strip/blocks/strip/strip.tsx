import type { Settings } from "./strip.types";

export function Strip(props: { settings: Settings }) {
    return (
        <div className="feat-item">
            <div dangerouslySetInnerHTML={{ __html: props.settings.svg_html }} />
            <strong>{props.settings.title}</strong>
            <span>{props.settings.subtitle}</span>
        </div>
    );
}
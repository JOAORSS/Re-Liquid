import { useState, useRef, useEffect } from "react";
import ShowcaseContainer from "../_showcase-container";
import type { Settings } from "./simple-container.types";

export function SimpleContainer(props: { settings: Settings }) {
    const [expanded, setExpanded] = useState(false);
    const [clamped, setClamped] = useState(false);
    const ref = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (el) setClamped(el.scrollHeight > el.clientHeight);
    }, [props.settings.content]);

    return (
        <ShowcaseContainer
            fullContainer="100%"
            orientation="column"
            backgroundColor={props.settings.background_color}
        >
            <div className="simple-container">
                <h2>{props.settings.title}</h2>
                <p
                    ref={ref}
                    className={!expanded ? "simple-container__clamped" : ""}
                    dangerouslySetInnerHTML={{ __html: props.settings.content }}
                />
                {clamped && (
                    <button className="simple-container__toggle" onClick={() => setExpanded(o => !o)}>
                        {expanded ? "Read less" : "Read more"}
                    </button>
                )}
            </div>
        </ShowcaseContainer>
    );
}
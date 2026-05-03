import ShowcaseContainer from "../_showcase-container";
import { YouTubeVideoPlayer } from "./_iframe";
import type { Settings } from "./video-gallery.types";


export function VideoGallery(props: { settings: Settings }) {
    return (
        <ShowcaseContainer
            orientation="row"
            mobileMode="overflow"
            fullContainer="var(--content-width)"
            title={props.settings.title}
        >
            <YouTubeVideoPlayer videoId="yn36Ey2K89M" />
            <YouTubeVideoPlayer videoId="yn36Ey2K89M" />
            <YouTubeVideoPlayer videoId="yn36Ey2K89M" />
            <YouTubeVideoPlayer videoId="yn36Ey2K89M" />
            <YouTubeVideoPlayer videoId="yn36Ey2K89M" />
            <YouTubeVideoPlayer videoId="yn36Ey2K89M" />
        </ShowcaseContainer>
    );
}
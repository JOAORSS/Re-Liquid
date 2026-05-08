import { LeftImageTabSection } from "../left-image-tab-section/left-image-tab-section";


export function ImageTabSection(props: { settings: any, blocks: any}) {
    return (
        <>
            <LeftImageTabSection
                settings={props.settings}
                blocks={props.blocks}
                imageRight={true}
            />
        </>
    );
}
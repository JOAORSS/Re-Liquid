import { LeftImageTabSection } from "../left-image-tab-section/left-image-tab-section";
import type { Settings } from './image-tab-section.types';
import type { Settings as BlockSettings } from '../left-image-tab-section/blocks/crystal-info/crystal-info.types';


export function ImageTabSection(props: { settings: Settings, blocks: BlockSettings[] }) {

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
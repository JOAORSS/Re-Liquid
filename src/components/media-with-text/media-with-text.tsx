import { styled } from '@linaria/react';
import type { Settings } from './media-with-text.types';

export function MediaText({ settings }: { settings: Settings }) {
    const layoutClass = `layout-${settings.layout_style}`;
    const positionClass = `pos-${settings.image_position}`;

    const containerStyle = {
        backgroundColor: settings.bg_color || 'transparent',
        color: settings.text_color || 'inherit'
    };

    return (
        <SectionWrapper style={containerStyle}>
            <Container className={`${layoutClass} ${positionClass}`}>
                
                <MediaBlock>
                    {settings.image && (
                        <Figure>
                            <img src={settings.image} style={{ aspectRatio: settings.layout_style == 'rows' ? '16/9' : 'auto' } as React.CSSProperties} alt="Media content" loading="lazy" />
                            {settings.image_label && (
                                <Figcaption dangerouslySetInnerHTML={{ __html: settings.image_label }} />
                            )}
                        </Figure>
                    )}
                </MediaBlock>

                <TextBlock>
                    <div dangerouslySetInnerHTML={{ __html: settings.richtext }} />
                </TextBlock>

            </Container>
        </SectionWrapper>
    );
}

const SectionWrapper = styled.section`
    width: 100%;
    padding: 80px 20px;
    font-family: var(--font-display);

    @media (max-width: 768px) {
        padding: 40px 0;
    }
`;

const Container = styled.div`
    max-width: var(--page-width, 1360px);
    margin: 0 auto;
    display: flex;
    gap: 60px;
    align-items: center;

    &.layout-columns.pos-default {
        flex-direction: row;
    }

    &.layout-columns.pos-inverted {
        flex-direction: row-reverse;
    }

    &.layout-rows.pos-default {
        flex-direction: column;
        text-align: center;
    }

    &.layout-rows.pos-inverted {
        flex-direction: column-reverse;
        text-align: center;
    }

    @media (max-width: 768px) {
        flex-direction: column !important;
        text-align: center;
        gap: 40px;
    }
`;

const MediaBlock = styled.div`
    flex: 1;
    width: 100%;
`;

const Figure = styled.figure`
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;

    img {
        width: 100%;
        height: auto;
        display: block;
        border-radius: 4px;
        object-fit: cover;
    }
`;

const Figcaption = styled.figcaption`
    font-family: var(--font-body, inherit);
    font-size: 14px;
    font-weight: 500;
    opacity: 0.8;
    text-align: left;

    .layout-rows & {
        text-align: center;
    }

    @media (max-width: 768px) {
        text-align: center;
    }
`;

const TextBlock = styled.div`
    flex: 1;
    width: 100%;
    font-family: var(--font-body, inherit);
    line-height: 1.6;

    h1, h2, h3, h4, h5, h6 {
        margin-top: 0;
        font-family: var(--font-heading, inherit);
        margin-bottom: 24px;
    }

    p {
        margin-top: 0;
        margin-bottom: 16px;
    }
`;
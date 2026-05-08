import { styled } from "@linaria/react";
import type { Settings as BlockSettings } from './blocks/crystal-info/crystal-info.types';
import { injectLiquidRaw } from '../../util/shopify';
import type { Settings } from './left-image-tab-section.types';

const image = injectLiquidRaw<string>(`
    {% if section.settings.image != blank %}
        {{ section.settings.image | img_url: 'master' | json }}
    {% else %}
        ""
    {% endif %}
`);

const imageBlock = injectLiquidRaw<string>(`
    {% if block.settings.image != blank %}
        {{ block.settings.image | img_url: 'master' | json }}
    {% else %}
        ""
    {% endif %}
`);

export function LeftImageTabSection({ settings, blocks, imageRight = false }: { settings: Settings, blocks: BlockSettings[], imageRight?: boolean }) {
    return (
        <SectionContainer>
            <GridContainer imageRight={imageRight}>
                <ImageWrapper imageRight={imageRight}>
                    <img src={image} alt="stone" width="960" height="512" loading="lazy" />
                </ImageWrapper>

                <ContentWrapper imageRight={imageRight}>
                    {blocks.map((block, index) => {
                        return (
                            <div key={index}>
                                <Title>{block.settings.title}</Title>
                                
                                <Intro dangerouslySetInnerHTML={{ __html: block.settings.richtext }} />

                                {block.settings['title-ta'] != "" && block.settings['text-ta'] != "" &&
                                    <Accordion>
                                        <summary>{block.settings['title-ta']}</summary>
                                        <AccordionContent dangerouslySetInnerHTML={{ __html: block.settings['text-ta'] }} />
                                    </Accordion>
                                }

                                {block.settings['title-tb'] != "" && block.settings['title-tb'] != "" &&
                                    <Accordion>
                                        <summary>{block.settings['title-tb']}</summary>
                                        <AccordionContent>{imageBlock}</AccordionContent>
                                    </Accordion>
                                }

                                {block.settings['title-tc'] != "" && block.settings['text-tc'] != "" &&
                                    <Accordion>
                                        <summary>{block.settings['title-tc']}</summary>
                                        <AccordionContent dangerouslySetInnerHTML={{ __html: block.settings['text-tc'] }} />
                                    </Accordion>
                                }
                            </div>
                        )
                    })}
                    
                    {settings['text-b1'] != "" && settings['link-b'] != "" &&
                        <CtaLink href={settings['link-b']}>
                            {settings['text-b1']}
                        </CtaLink>
                    }
                </ContentWrapper>
            </GridContainer>
        </SectionContainer>
    );
}

const SectionContainer = styled.section`
    padding: 40px 20px;
    margin: 0 auto;
    border-top: 2px solid var(--plum, #6b4c7a);
    border-bottom: 2px solid var(--plum, #6b4c7a);
`;

const GridContainer = styled.div<{ imageRight: boolean }>`
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;

    @media (min-width: 768px) {
        grid-template-columns: ${({ imageRight }) => imageRight ? '8fr 4fr' : '4fr 8fr'};
        gap: 48px;
    }
`;

const ImageWrapper = styled.div<{ imageRight: boolean }>`
    @media (min-width: 768px) {
        order: ${({ imageRight }) => imageRight ? 2 : 1};
    }

    img {
        width: 100%;
        max-width: 800px;
        height: auto;
        object-fit: cover;
        display: block;
        border-radius: 6px;
    }
`;

const ContentWrapper = styled.div<{ imageRight: boolean }>`
    display: flex;
    flex-direction: column;

    @media (min-width: 768px) {
        order: ${({ imageRight }) => imageRight ? 1 : 2};
    }
`;

const Title = styled.h2`
    font-family: var(--font-display);
    font-size: 28px;
    color: var(--dark);
    font-weight: 400;
    margin-bottom: 8px;
    margin-top: 0;
`;

const Intro = styled.div`
    font-family: var(--font-body);
    color: var(--dark);
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 24px;

    p:first-of-type {
        font-style: italic;
        color: var(--dark);
        margin-bottom: 12px;
    }
`;

const Accordion = styled.details`
    margin-bottom: 8px;
    background-color: var(--plum-light, #f5f0f6);
    border-radius: 4px;
    overflow: hidden;

    summary {
        padding: 12px 16px;
        font-family: var(--font-body);
        font-size: 14px;
        color: var(--plum, #6b4c7a);
        cursor: pointer;
        list-style: none;
    }

    summary::-webkit-details-marker {
        display: none;
    }

    &[open] summary {
        border-bottom: 1px solid rgba(0,0,0,0.05);
    }
`;

const AccordionContent = styled.div`
    padding: 16px;
    font-family: var(--font-body);
    font-size: 13px;
    color: var(--dark);
    line-height: 1.6;

    img {
        max-width: 100%;
        height: auto;
        display: block;
        margin-top: 10px;
    }
`;

const CtaLink = styled.a`
    display: inline-block;
    margin-top: 24px;
    font-family: var(--font-body);
    font-size: 13px;
    color: var(--plum);
    text-decoration: none;
    font-weight: 600;
`;
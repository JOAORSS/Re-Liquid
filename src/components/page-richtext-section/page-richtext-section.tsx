import { styled } from "@linaria/react";
import type { Settings as BlockSettings } from './blocks/richtext/richtext.types';
import type { Settings } from './page-richtext-section.types';

export function PageRichtextSection({ id, settings, blocks }: { id: string, settings: Settings, blocks: BlockSettings[]}) {
    return (
        <>
        <style>{`
            #shopify-section-${id} {
                grid-column: 1 / -1;
                background-color: var(--dark);
                padding: 0;
            }
        `}</style>
        <SectionContainer>
            <Wrapper>
                <Grid>
                    <Header>
                        {settings['title-t'] && settings['title-t'] !== "" && (
                            <Subheading>{settings['title-t']}</Subheading>
                        )}
                        
                        {settings.title && settings.title !== "" && (
                            <Heading dangerouslySetInnerHTML={{ __html: settings.title }} />
                        )}

                        {settings.cta_url && settings.cta_text && settings.cta_url !== "" && settings.cta_text !== "" && (
                            <CtaBtn href={settings.cta_url}>
                                {settings.cta_text}
                            </CtaBtn>
                        )}
                    </Header>

                    <Content>
                        {blocks.map((block, index) => {
                            return (
                                <RichtextBlock key={index}>
                                    <div dangerouslySetInnerHTML={{ __html: block.settings.richtext }} />
                                    {settings.image && settings.image !== "" && <HeaderImage src={settings.image} alt="" />}
                                    
                                    {block.settings.cta_url && block.settings.cta_text && block.settings.cta_url !== "" && block.settings.cta_text !== "" && (
                                        <CtaBtn href={block.settings.cta_url}>
                                            {block.settings.cta_text}
                                        </CtaBtn>
                                    )}
                                </RichtextBlock>
                            )
                        })}
                    </Content>
                </Grid>
            </Wrapper>
        </SectionContainer>
        </>
    );
}

const HeaderImage = styled.img`
    margin-top: 16px;
    max-height: 200px;
    height: 100%;
    width: auto;
    border-radius: 4px;
    object-fit: cover;

    @media (max-width: 768px) {
        max-height: 200px;
    }
`;

const SectionContainer = styled.section`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--dark);
    color: white;    
`;

const Wrapper = styled.div`
    max-width: var(--content-width, 1200px);
    width: 100%;
    margin: 0 auto;
    padding: 60px;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;

    @media (min-width: 768px) {
        grid-template-columns: 1fr 3fr;
        gap: 48px;
    }
`;

const Header = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const Subheading = styled.h4`
    font-family: var(--font-body);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin: 0;
    opacity: 0.7;
`;

const Heading = styled.div`
    font-family: var(--font-display);
    font-size: 22px;
    margin: 0;
    line-height: 1.5;

    a {
        color: inherit;
        text-decoration: none;
        border-bottom: 1px solid transparent;
        transition: all 0.2s;
    }

    a:hover {
        border-bottom-color: currentColor;
        opacity: 0.8;
    }
`;

const Content = styled.div`
    font-family: var(--font-body);
    font-size: 15px;
    line-height: 1.6;

    h5 {
        font-family: var(--font-display);
        font-size: 18px;
        margin-top: 0;
        margin-bottom: 16px;
        font-weight: 400;
    }

    p {
        margin-bottom: 16px;
    }
`;

const RichtextBlock = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const CtaBtn = styled.a`
    display: inline-block;
    margin-top: 24px;
    padding: 14px 28px;
    background-color: var(--plum, #6b4c7a);
    color: #fff;
    text-decoration: none;
    border-radius: 4px;
    text-transform: uppercase;
    font-weight: 700;
    font-size: 11px;
    letter-spacing: 1.5px;
    transition: background-color 0.2s;

    img {
        
    }

    &:hover {
        background-color: var(--dark, #333);
    }
`;
import type { Settings } from './universal-richtext.types';
import type { Settings as Block } from './blocks/accordion/accordion.types';
import { AccordionBlock } from './blocks/accordion/accordion';
import './universal-richtext.css';

export function UniversalRichText({ id, settings, blocks }: { id: string, settings: Settings, blocks: Block[] }) {
    const layoutClass = `urt-layout--${settings.layout_position}`;
    const mediaClass = `urt-media--${settings.media_type}`;
    
    const containerStyle = {
        backgroundColor: settings.bg_color || 'transparent',
        color: settings.text_color || 'inherit'
    };

    return (
        <>
        <style>{`
            #shopify-section-${id} {
                grid-column: 1 / -1;
                background-color: ${containerStyle.backgroundColor};
                font-family: var(--font-display);
            }
        `}</style>
        <section className="urt-section" id={id} style={containerStyle}>
            <div className={`urt-container ${layoutClass} ${mediaClass}`}>
                
                {settings.media_type !== 'none' && (
                    <div className="urt-media-block">
                        {settings.media_type === 'title' && settings.title && (
                            <h2 className="urt-title">{settings.title}</h2>
                        )}
                        
                        {settings.media_type === 'image' && settings.image && (
                            <img 
                                src={settings.image} 
                                alt={settings.title || "Section media"} 
                                className="urt-image" 
                                loading="lazy" 
                            />
                        )}
                    </div>
                )}

                <div className="urt-content-block">
                    {settings.layout_position === 'center' && settings.media_type === 'none' && settings.title && (
                        <h2 className="urt-title-center">{settings.title}</h2>
                    )}

                    {settings.media_type === 'image' && settings.title !== '' && (
                        <h2 className="urt-title">{settings.title}</h2>
                    )}

                    <div 
                        className="urt-html"
                        dangerouslySetInnerHTML={{ __html: settings.richtext }} 
                    />

                    {settings.cta_text && settings.cta_url && (
                        <a href={settings.cta_url} className="urt-cta">
                            {settings.cta_text}
                        </a>
                    )}
                </div>
            </div>

            {blocks && blocks.length > 0 && (
                <div className="urt-blocks-container">
                    {blocks.map((block) => (
                        <AccordionBlock key={`block-accordion-${block.id}`} block={block} />
                    ))}
                </div>
            )}
        </section>
        </>
    );
}
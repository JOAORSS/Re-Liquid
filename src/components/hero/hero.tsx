import { useState, useEffect } from 'react';
import type { Settings } from './hero.types';
import "./hero.css"

interface Slide {
    image: string;
    url?: string;
}

export function Hero(props: { settings: Settings }) {
    const slides: Slide[] = [];

    if (props.settings.image_1) slides.push({ image: props.settings.image_1, url: props.settings.action_url_1 });
    if (props.settings.image_2) slides.push({ image: props.settings.image_2, url: props.settings.action_url_2 });
    if (props.settings.image_3) slides.push({ image: props.settings.image_3, url: props.settings.action_url_3 });
    if (props.settings.image_4) slides.push({ image: props.settings.image_4, url: props.settings.action_url_4 });
    if (props.settings.image_5) slides.push({ image: props.settings.image_5, url: props.settings.action_url_5 });

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (slides.length <= 1) return;
        
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 5000);
        
        return () => clearInterval(timer);
    }, [slides.length]);

    if (slides.length === 0) return null;

    return (
        <div className="hero-carousel-wrapper">
            <div 
                className="hero-carousel-track"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {slides.map((slide, index) => {
                    const content = <img src={slide.image} alt={`Hero ${index + 1}`} loading="lazy" className="hero-banner-img" />;
                    
                    return (
                        <div key={index} className="hero-slide">
                            {slide.url ? (
                                <a href={slide.url} className="hero-banner">
                                    {content}
                                </a>
                            ) : (
                                <div className="hero-banner">
                                    {content}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {slides.length > 1 && (
                <div className="hero-pagination">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`hero-dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                            aria-label={`Slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
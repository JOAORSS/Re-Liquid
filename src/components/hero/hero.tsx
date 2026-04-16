import type { Settings } from './hero.types';

export function Hero(props: { settings: Settings }) {
    return (
        <>
            {props.settings.image && (
                <a href={props.settings.action_url} className='hero-banner'>
                    <img src={props.settings.image} alt="Hero" loading='lazy' className='hero-banner-img' />
                </a>
            )}
        </>
    );
}
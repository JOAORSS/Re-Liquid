import React from 'react';
import { styled } from '@linaria/react';
import type { Settings } from './full-width-image.types';

export function FullWidthImage({ settings }: { settings: Settings }) {
    if (!settings.image) return null;

    return (
        <Container 
            style={{ 
                '--banner-height': `${settings.height_vh}vh`,
                '--object-fit': settings.object_fit 
            } as React.CSSProperties}
        >
            <StyledImage 
                src={settings.image} 
                alt="Banner image" 
                loading="lazy" 
            />
        </Container>
    );
}

const Container = styled.section`
    width: 100vw;
    margin-left: calc(-50vw + 50%); /* Garante que ignore o padding do container pai para ser 100vw real */
    height: var(--banner-height);
    overflow: hidden;
    line-height: 0;
`;

const StyledImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: var(--object-fit);
    object-position: center;
    display: block;
`;
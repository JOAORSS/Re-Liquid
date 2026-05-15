import { styled } from '@linaria/react';
import type { Settings } from './accordion.types';
import { useState } from 'react';

export function AccordionBlock( { block } : { block: Settings }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <AccordionContainer>
            <Summary onClick={() => setIsOpen(!isOpen)}>
                {block.settings.title}
                <Icon className={isOpen ? 'open' : ''} />
            </Summary>
            <ContentGrid className={isOpen ? 'open' : ''}>
                <ContentInner>
                    <Content dangerouslySetInnerHTML={{ __html: block.settings.richtext }} />
                </ContentInner>
            </ContentGrid>
        </AccordionContainer>
    );
}

const AccordionContainer = styled.div`
    width: 100%;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const Summary = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 0;
    font-family: var(--font-heading, inherit);
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    color: inherit;
    transition: opacity 0.2s ease;

    &:hover {
        opacity: 0.8;
    }
`;

const Icon = styled.span`
    position: relative;
    width: 12px;
    height: 12px;
    display: block;
    flex-shrink: 0;
    margin-left: 16px;
    
    &::before, &::after {
        content: '';
        position: absolute;
        background-color: currentColor;
        transition: transform 0.3s ease, opacity 0.3s ease;
    }

    &::before {
        top: 50%;
        left: 0;
        width: 100%;
        height: 1px;
        transform: translateY(-50%);
    }

    &::after {
        top: 0;
        left: 50%;
        width: 1px;
        height: 100%;
        transform: translateX(-50%);
    }

    &.open::after {
        transform: translateX(-50%) rotate(90deg);
        opacity: 0;
    }
`;

const ContentGrid = styled.div`
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.3s ease-in-out;

    &.open {
        grid-template-rows: 1fr;
    }
`;

const ContentInner = styled.div`
    overflow: hidden;
`;

const Content = styled.div`
    padding-bottom: 24px;
    font-family: var(--font-body, inherit);
    font-size: 16px;
    line-height: 1.6;
    color: inherit;
    opacity: 0.9;

    p {
        margin: 0 0 16px 0;
    }
    
    p:last-child {
        margin-bottom: 0;
    }
`;
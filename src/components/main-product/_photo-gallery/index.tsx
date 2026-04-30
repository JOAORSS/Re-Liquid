import { useState } from "react";
import { styled } from "@linaria/react";

interface GalleryProps {
    images: string[];
    alt?: string;
}

export default function PhotoGallery({ images, alt = "" }: GalleryProps) {
    const [active, setActive] = useState(0);

    return (
        <Wrap>
            <Main>
                <img src={images[active]} alt={alt} />
            </Main>

            <ThumbsWrap>
                <Thumbs>
                    {images.map((src, i) => (
                        <Thumb
                            key={i}
                            active={i === active}
                            onClick={() => setActive(i)}
                        >
                            <img src={src} alt={`${alt} ${i + 1}`} />
                        </Thumb>
                    ))}
                </Thumbs>
                <ThumbsFade />
            </ThumbsWrap>
        </Wrap>
    );
}

const Wrap = styled.div`
    position: sticky;
    top: 80px;
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 0;

    @media (max-width: 768px) {
        position: relative;
        top: auto;
    }
`;

const Main = styled.div`
    aspect-ratio: 1;
    overflow: hidden;
    background: var(--light);
    border-radius: 8px;
    margin-bottom: 10px;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }
`;

const ThumbsWrap = styled.div`
    position: relative;
`;

const Thumbs = styled.div`
    display: flex;
    gap: 8px;
    overflow-x: auto;
    scrollbar-width: none;
    padding-bottom: 2px;

    &::-webkit-scrollbar {
        display: none;
    }
`;

const Thumb = styled.div<{ active: boolean }>`
    width: 72px;
    height: 72px;
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 6px;
    border: 2px solid ${({ active }) => active ? "var(--plum)" : "transparent"};
    opacity: ${({ active }) => active ? 1 : 0.5};
    cursor: pointer;
    transition: all 0.2s;
    background: var(--light);

    &:hover {
        opacity: 1;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }
`;

const ThumbsFade = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 48px;
    background: linear-gradient(to right, transparent, #fff);
    pointer-events: none;
`;
import { styled } from "@linaria/react";
import { useEffect, useRef, useState } from "react";

interface ShowcaseContainerProps {
    children: React.ReactNode;
    name?: string;
    title?: string;
    subtitle?: string;
    glyph?: string;
    showMore?: { text: string, url: string };
    header?: boolean;
    backgroundColor?: string;
    fullContainer? : "var(--content-width)" | "100%";
    orientation?: "column" | "row";
    mobileMode?: "overflow" | "column";
    filterChildren?: React.ReactNode;
}

export default function ShowcaseContainer(
{ 
    children, 
    name, 
    title, 
    subtitle, 
    glyph, 
    showMore,
    filterChildren,
    header = true,
    backgroundColor = "#ffffff",
    fullContainer = "100%",
    orientation = "row",
    mobileMode = "overflow"
}
: ShowcaseContainerProps) {

    const sectionRef = useRef<HTMLDivElement>(null);
    const [sectionId, setSectionId] = useState('');

    useEffect(() => {
        const id = sectionRef.current?.closest('[id^="react-widget-"]')?.id ?? '';
        setSectionId(id);
    }, []);

    return (
        <>
        <style>{`
            .shopify-section #${sectionId} {
                grid-column: ${(fullContainer !== "100%" || mobileMode !== "column") ? "1 / -1" : "2" };
                background-color: ${backgroundColor};
            }
        `}</style>
        <Container 
            ref={sectionRef} 
            contentWidth={fullContainer} 
            mobilePadding={mobileMode === "overflow" ? "50px 10px" : "50px 20px"} 
            mobileMargin={mobileMode === "overflow" ? "0" : "0 auto"}
        >
            {header && (
            <Header>
                {glyph && <Glyph dangerouslySetInnerHTML={{ __html: glyph }} />}
                {name && <Section>{name}</Section>}
                {title && <Title>{title}</Title>}
                {subtitle && <Subtitle>{subtitle}</Subtitle>}
            </Header>)}
            {filterChildren && (
            <FilterContainer>
                {filterChildren}                
            </FilterContainer>)}
            <ChildContainer 
                containerWidth={orientation === "row" ? "100%" : "var(--content-width)"}
                orientation={orientation}
                wrap={mobileMode === "column" ? "wrap" : "nowrap" }
                mobileOrientation={mobileMode === "column" ? "column" : "row"}
                scrollX={mobileMode === "column" ? "hidden" : "scroll" }
            >
                {children}
            </ChildContainer>
            {showMore && <ShowMore href={showMore.url}>{showMore.text}</ShowMore>}
        </Container>
        </>
    );
}

const Container = styled.section<{ contentWidth: string, mobilePadding: string, mobileMargin: string }>`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
    padding: 50px 20px;
    width: 100%;
    max-width: ${props => props.contentWidth};

    @media (max-width: 1024px) {
        padding: ${props => props.mobilePadding} !important;
        margin: ${props => props.mobileMargin} !important;
        max-width: none !important;
    }
`;

const Header = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 40px;
`;

const FilterContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 40px;
`;

const ChildContainer = styled.div<{
    containerWidth: string,
    wrap: "wrap" | "nowrap",
    mobileOrientation: "row" | "column", 
    orientation: "column" | "row",
    scrollX: "hidden" | "scroll"
}>`
    width: ${props => props.containerWidth};
    display: flex;
    flex-direction: ${props => props.orientation};
    gap: 20px;
    justify-content: space-evenly;
    align-items: center;
    flex-wrap: nowrap;
    overflow-x: scroll;

    @media (max-width: 1024px) {
        flex-wrap: ${props => props.wrap};
        flex-direction: ${props => props.mobileOrientation};
        overflow-x: ${props => props.scrollX};
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }
`

const Section = styled.span`
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 8px;
    display: block;
`;

const Title = styled.h2`
    font-family: 'Barlow', sans-serif;
    font-size: 34px;
    font-weight: 300;
    color: var(--dark);
    line-height: 1.2;
    margin-bottom: 8px;
`;

const Subtitle = styled.h3`
    font-size: 13px;
    color: var(--grey);
    line-height: 1.7;
    font-weight: 400;
`;

const Glyph = styled.svg`
    width: 56px;
    height: 36px;
    stroke: var(--gold);
    fill: none;
    stroke-width: 1.5;
    display: block;
    margin: 0 auto 16px;
`;

const ShowMore = styled.a`
    display: inline-block;
    background: transparent;
    color: var(--plum);
    cursor: pointer;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    text-decoration: none;
    margin-top: 32px;
    text-align: center;
`;


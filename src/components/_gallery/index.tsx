import { styled } from "@linaria/react";

export default function Gallery({ children }: { children: React.ReactNode }) {
    return (
        <Container>{children}</Container>
    );
}   

const Container = styled.div<{ children: React.ReactNode }>`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
`;
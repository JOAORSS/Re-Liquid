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

    @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 348px) {
        grid-template-columns: repeat(1, 1fr) !important;
    }
`;
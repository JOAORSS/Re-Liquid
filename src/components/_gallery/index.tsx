import { styled } from "@linaria/react";

export default function Gallery({ children, columns = 4 }: { children: React.ReactNode, columns?: number }) {
    return (
        <Container columns={columns}>{children}</Container>
    );
}   

const Container = styled.div<{ columns: number }>`
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;

    @media (max-width: 1336px) {
        grid-template-columns: repeat(${props => props.columns}, 1fr);
    }

    @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 348px) {
        grid-template-columns: repeat(1, 1fr) !important;
    }
`;
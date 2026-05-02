export function injectLiquid<T = any>(liquidString: string): T {
    liquidString;
    return null as unknown as T;
}

export function injectLiquidRaw<T = any>(liquidString: string): T {
    liquidString;
    return null as unknown as T;
}

export function calculateProductRating(id: number): { rating: number; reviewCount: number } {

    const idNum = Number(id || 1);

    const randRating = Math.abs(Math.sin(idNum)) * 10000 % 1;
    const randCount = Math.abs(Math.cos(idNum)) * 10000 % 1;

    const ratingValue = Number((3.8 + (randRating * 1.2)).toFixed(1));
    const countValue = 21 + Math.floor(randCount * (281 - 21 + 1));

    return { rating: ratingValue, reviewCount: countValue };
}

export function normalizeTag(tag: string): string {
    const lower = tag.toLowerCase().trim();
    
    if (lower.endsWith("ies")) {
        return lower.slice(0, -3) + "y";
    }
    if (lower.endsWith("ses") || lower.endsWith("xes") || lower.endsWith("ches") || lower.endsWith("shes")) {
        return lower.slice(0, -2);
    }
    if (lower.endsWith("s") && !lower.endsWith("ss") && !lower.endsWith("is") && !lower.endsWith("us")) {
        return lower.slice(0, -1);
    }

    return lower;
}

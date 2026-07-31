
export interface PaginationResult {
    page: number;
    limit: number;
    skip: number
}

export const getPagination = (
    query: Record<string, unknown>
): PaginationResult => {

    const page = typeof query.page === 'string' ? parseInt(query.page) : 1;

    const limit = typeof query.limit === 'string' ? parseInt(query.limit) : 10;

    const safePage = page > 0 ? page : 1;
    
    const safeLimit =
        limit > 0 && limit <= 100 ? limit : 10;

    const skip = (safePage - 1) * safeLimit;

    return {
        page: safePage as number,
        limit: safeLimit as number,
        skip,
    };
} 
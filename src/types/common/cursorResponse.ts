export interface CursorResponse<T> {
    nextCursor: string | null;
    hasMore: boolean;
    items: T;
}

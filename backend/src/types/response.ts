export type PagingResponse<T> = {
    total_page: number;
    total_record: number | bigint;
    data: T;
};
export type PagingArrayResponse<T> = {
    total_page: number;
    total_record: number;
    data: T[];
};

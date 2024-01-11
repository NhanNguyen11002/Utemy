export type Category = {
    category_id: number;
    title: string;
    url_image: string;
    description: string;
};

export type NewCategory = {
    title: string;
    description: string;
    category_image: File | null | undefined;
};

export type GetCategoriesWithPagination = {
    searchItem: string;
    pageIndex: number;
};

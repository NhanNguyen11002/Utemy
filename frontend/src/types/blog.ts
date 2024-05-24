import { Category } from "./category";
import { User } from "./user";

export type Blog = {
    blog_id: number;
    title: string;
    url_image: string;
    content: string;
    categories: Category[];
    created_at?: Date | string;
    updated_at?: Date | string;
    author?: User;
    is_published: boolean;
};

export type NewBlog = {
    title: string;
    content: string;
    image_blog: File | null | undefined;
};

export type GetBlogsWithPagination = {
    searchItem: string;
    pageIndex: number;
};

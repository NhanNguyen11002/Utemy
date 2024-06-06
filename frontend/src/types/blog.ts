import { Category } from "./category";
import { User } from "./user";

export type Blog = {
    blog_id: number;
    title: string;
    slug: string;
    url_image: string;
    content: string;
    view: number;
    like: number;
    dislike: number;
    categories: Category[];
    created_at?: Date | string;
    updated_at?: Date | string;
    author: User;
    is_published: boolean;
};

export type NewBlog = {
    title: string;
    image_blog: File | null | undefined;
};
export type EditBlog = {
    title: string;
    image_blog: File | null | undefined;
    content: string;
    categories: any; // mảng
};
export type GetBlogsWithPagination = {
    searchItem: string;
    pageIndex: number;
    category?: number[];
};

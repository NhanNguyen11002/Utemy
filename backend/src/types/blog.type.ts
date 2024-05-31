import { DateTime } from "luxon";
import { Author } from "./user";
import { Category } from "./course";
export type BlogResponse = {
    blog_id: number;
    title: string;
    slug: string;
    content: string;
    url_image: string;
    created_at: DateTime | null;
    updated_at: DateTime | null;
    is_published: boolean;
    author: Author;
    categories: Category[];
};

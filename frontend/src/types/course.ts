import { User } from "./user";
import { Category } from "./category";
import { Section } from "./section";
export type SearchMyCourseEnrolledCourse = {
    keyword: string | undefined;
    pageIndex: number;
};
export type Course = {
    course_id: number;
    title: string;
    slug: string;
    status: boolean;
    description: string;
    thumbnail: string;
    summary: string;
    number_of_section: number;
    number_of_rating: number;
    number_of_enrolled: number;
    author?: User;
    price?: number;
    sale_price?: number;
    sale_until?: Date;
    average_rating: number;
    categories: Category[];
    created_at?: Date;
    updated_at?: Date;
    sections?: Section[];
};
export type PagingCourse = {
    total_page: number;
    total_record: number;
    data: Course[];
};
export type NewCourse = {
    title: string;
    slug: string;
    description: string;
    summary: string;
    categories: number[];
    status: boolean;
    thumbnail: File | null;
    price: number;
};

export type CourseDetail = {
    slug: string;
    title: string;
    categories: Category[];
    summary: string;
    author: User;
    rating: number | undefined;
    description: string;
    price: number;
    created_at: string;
    updated_at: string;
    thumbnail: string;
    status: boolean;
};
export type RightOfCourse = {
    role: string;
};

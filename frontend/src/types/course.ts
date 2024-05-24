import { User } from "./user";
import { Category } from "./category";
import { Section } from "./section";
import { Approval } from "./approval";
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
    number_of_lecture?: number;
    overall_progress?: number;
    number_of_rating: number;
    number_of_enrolled: number;
    author?: User;
    price?: number;
    sale_price?: number;
    sale_until?: Date | string;
    average_rating: number;
    categories: Category[];
    created_at?: Date | string;
    updated_at?: Date | string;
    sections?: Section[];
    requirement?: any;
    study?: any;
    test?: any;
    approval?: Approval[];
    final_test_id?: number | null;
    url_trailer: string;
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
    trailer: File | null;
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
export type EditCourse = {
    course_id: number;
    slug: string;
    title: string;
    categories: any;
    summary: string;
    description: string;
    price: number;
    thumbnail: File | null;
    trailer: File | null;
    status: boolean | StatusOption;
};
export type StatusOption = {
    value: boolean;
    label: string;
};
export type RightOfCourse = {
    role: string;
};

// export type AddPromotion = {
//     sale_price: number;
//     sale_until: Date;
// };
export type AddPromotion = {
    sale_price: number;
    sale_until: string;
    course_id: number;
};
export type UpdateTargetCourse = {
    course_id: number;
    requirement: string[];
    study: string[];
};
export type SearchAllCourses = {
    pageIndex: number;
    rating?: number | undefined;
    category?: number[];
    keyword?: string;
    sortBy?: string;
};

export type SearchAllCoursesResponse = {
    total_page: number;
    total_record: number;
    data: Course[];
};

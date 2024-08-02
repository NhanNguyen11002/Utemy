import { Author } from "./user";
import { Section } from "./section";
import { Approval } from "./approval";
import { Prisma } from "@prisma/client";
export type CourseDetail = {
    course_id: number;
    title: string;
    slug: string;
    categories: Category[];
    status: boolean;
    description: string;
    thumbnail: string;
    url_trailer: string;
    summary: string;
    // is_delete: boolean;
    // created_at: Date;
    // updated_at: Date;
    sections: Section[];
    average_rating: number;
    number_of_section?: number;
    number_of_lecture?: number;
    number_of_rating: number;
    number_of_enrolled: number;
    author: Author;
    price: number;
    sale_price: number | null;
    sale_until: Date | null;
    updated_at?: Date | string | null;
    requirement?: Prisma.JsonValue;
    study?: Prisma.JsonValue;
    approval?: Approval[];
    final_test_id?: number | null;
    test?: any;
};

export type CourseInfo = {
    id: number;
    title: string;
    summary: string;
    thumbnail: string;
    rating: number;
    author: Author;
    category: string[];
    number_section: number;
    slug: string;
    attendees: number;
};

export type CourseEdit = {
    id: number;
    slug: string;
    title: string;
    categories: Category[];
    summary: string;
    thumbnail: string;
    description: string;
    created_at: Date;
    updated_at: Date;
    status: boolean;
};

export type Category = {
    category_id: number;
    title?: string;
    url_image: string;
    //description: string;
};

export type OutstandingCourse = {
    course_id: number;
    thumbnail: string;
    title: string;
    slug: string;
    categories: Category[];
    author: Author;
    created_at: Date;
    updated_at: Date;
    status: boolean;
    average_rating: number;
    number_of_enrolled?: number;
    number_of_rating?: number;
};

export type CourseCard = {
    id: number;
    slug: string;
    title: string;
    categories: Category[];
    summary: string;
    author: Author;
    thumbnail: string;
    total_of_rating: number;
    number_of_enrolled: number;
};

export type CourseOrderByWithRelationInput = {
    [x: string]: "asc" | "desc" | { _count?: "asc" | "desc" } | undefined;
    created_at?: "asc" | "desc" | undefined;
    price?: "asc" | "desc" | undefined;
    ratings?: { _count?: "asc" | "desc" } | undefined;
    enrolleds?: { _count?: "asc" | "desc" } | undefined;
    sections?: { _count?: "asc" | "desc" } | undefined;
};

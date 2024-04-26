import { Course } from "./course";
export type User = {
    first_name: string;
    last_name: string;
    email: string;
    url_avatar?: string;
    user_id: number | undefined;
    description: string;
    is_admin?: boolean;
    is_delete?: boolean;
    created_at?: Date | string;
};
export type EnrolledAuthor = {
    first_name: string;
    last_name: string;
    url_avatar?: string;
    user_id: number | undefined;
    description: string;
    average_rating_all_course: number;
    number_of_enrolled_all_course: number;
};
export type UserAvatar = {
    url_avatar?: string;
};
export type UpdateInformation = {
    first_name: string | undefined;
    last_name: string | undefined;
    description: string | undefined;
};
export type AuthorInformation = {
    user: User;
    courses: Course[];
};
export type CreateNewUser = {
    first_name: string;
    last_name: string;
    email: string;
    is_admin: boolean;
    password: string;
    confirm_password: string;
};
export type GetAllUser = {
    pageIndex: number;
    role: string;
    searchItem: string;
};
export type EditUser = {
    first_name: string;
    last_name: string;
    is_admin: boolean;
    id?: number;
};
export type OwnerComment = {
    id: number;
    first_name: string;
    last_name: string;
    url_avatar: string | undefined;
}
export type OwnerReply = {
    user_id: number;
    first_name: string;
    last_name: string;
    url_avatar: string | undefined;
}
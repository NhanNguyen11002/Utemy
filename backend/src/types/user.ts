export type Author = {
    first_name: string;
    last_name: string;
    user_id: number;
    is_admin?: boolean;
};
export type OwnerComment = {
    first_name: string;
    last_name: string;
    id: number;
    url_avatar: string | undefined;
};
export type User = {
    first_name: string;
    last_name: string;
    email: string;
    url_avatar: string;
    user_id: number | undefined;
    description: string;
    is_admin: boolean;
    is_delete?: boolean;
    created_at?: Date | string;
};

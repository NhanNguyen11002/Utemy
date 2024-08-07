import {  OwnerReply } from "./user"

export type Dislike = {
    dislike_id: number,
    user: OwnerReply;
    comment_id: number;
    reply_id: number | null;
    updatedAt: string;
}
export type Reaction = {
    id: number;
    user: OwnerReply;
    comment_id: number;
    reply_id: number | null;
    updatedAt: string;
};
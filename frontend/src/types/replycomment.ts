import {OwnerReply } from "./user";

export type ReplyComment = {
    reply_id: number;
    content: string;
    updatedAt: string;
    user: OwnerReply;
    likes_count: number;
    dislikes_count: number;
}
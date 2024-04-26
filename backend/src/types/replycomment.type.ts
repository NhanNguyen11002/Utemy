import { DateTime } from "luxon";
import { LikeResponse } from "./like.type";
import { DislikeResponse } from "./dislike.type";
import { OwnerComment } from "./user";
export type ReplyCommentResponse = {
    reply_id: number;
    content: string;
    comment_id: number;
    updatedAt: DateTime | null;
    likes_count: number | 0;
    dislikes_count: number | 0;
    user: OwnerComment;
    likes: LikeResponse[];
    dislikes: DislikeResponse[];
};
export type ReplyCommentType = {
    id: number;
    content: string;
    comment_id: number;
    updatedAt: DateTime | null;
    likes_count: number | 0;
    dislikes_count: number | 0;
    user: OwnerComment;
    likes: LikeResponse[];
    dislikes: DislikeResponse[];
};
export type ReplyCommentLecture = {
    reply_id: number;
    content: string;
    updatedAt: DateTime | null;
    likes_count: number | 0;
    dislikes_count: number | 0;
    user: OwnerComment;
    likes: LikeResponse[];
    dislikes: DislikeResponse[];
};

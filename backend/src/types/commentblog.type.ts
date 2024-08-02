import { DateTime } from "luxon";
import { OwnerComment } from "./user";
import { ReactionResponse } from "./reactionblog.type";
export type CommentBlogResponse = {
    commentblog_id: number;
    content: string;
    blog_id: number;
    updated_at: DateTime | null;
    user: OwnerComment;
    replies: CommentBlogResponse | null;
    reactions: ReactionResponse[];
};
export type ReplyBlogResponse = {
    id: number;
    content: string;
    blog_id: number;
    updated_at: DateTime | null;
    user: OwnerComment;
    replies: CommentBlogResponse | null;
    reactions: ReactionResponse[];
};
import { DateTime } from "luxon";
import { ReplyCommentLecture } from "@prisma/client";
import { LikeResponse } from "./like.type";
import { DislikeResponse } from "./dislike.type";
import { OwnerComment } from "./user";
export type CommentResponse = {
    comment_id: number;
    content: string;
    lecture_id: number;
    updatedAt: DateTime | null;
    likes_count: number | 0;
    dislikes_count: number | 0;
    user: OwnerComment;
    replyCommentLectures: ReplyCommentLecture | null;
    likes: LikeResponse[];
    dislikes: DislikeResponse[];
};

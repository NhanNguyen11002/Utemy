import { DateTime } from "luxon";
import { CommentResponse } from "./comment.type";
import { ReplyCommentResponse } from "./replycomment.type";
import { OwnerComment } from "./user";
export type LikeResponse = {
    like_id: number;
    user: OwnerComment;
    comment_id: number;
    reply_id: number | null;
    updatedAt: DateTime | null;
    commentLecture: CommentResponse;
    replyCommentLecture: ReplyCommentResponse;
};

export type LikeType = {
    id: number;
    user: OwnerComment;
    comment_id: number;
    reply_id: number | null;
    updatedAt: DateTime | null;
    commentLecture: CommentResponse;
    replyCommentLecture: ReplyCommentResponse;
};
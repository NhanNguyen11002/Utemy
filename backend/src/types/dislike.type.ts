import { DateTime } from "luxon";
import { CommentResponse } from "./comment.type";
import { ReplyCommentResponse } from "./replycomment.type";
import { OwnerComment } from "./user";
export type DislikeResponse = {
    dislike_id: number;
    user: OwnerComment;
    comment_id: number;
    reply_id: number | null;
    updatedAt: DateTime | null;
    commentLecture: CommentResponse;
    replyCommentLecture: ReplyCommentResponse;
};
export type DislikeType = {
    id: number;
    user: OwnerComment;
    comment_id: number;
    reply_id: number | null;
    updatedAt: DateTime | null;
    commentLecture: CommentResponse;
    replyCommentLecture: ReplyCommentResponse;
};
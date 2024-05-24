import { DateTime } from "luxon";
import { CommentResponse } from "./comment.type";
import { ReplyCommentResponse } from "./replycomment.type";
import { OwnerComment } from "./user";
export enum EnumReactionType {
    LIKE,
    DISLIKE,
}
export type ReactionResponse = {
    reaction_id: number;
    user: OwnerComment;
    commentblog_id: number;
    type: EnumReactionType;
    updated_at: DateTime | null;
};

export type ReactionType = {
    id: number;
    user: OwnerComment;
    commentblog_id: number;
    type: EnumReactionType;
    updated_at: DateTime | null;
};

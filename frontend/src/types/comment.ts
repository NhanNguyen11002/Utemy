import { Dislike } from "./dislike";
import { Like } from "./like";
import { ReplyComment } from "./replycomment";
import { OwnerComment } from "./user";

export type GetCommentsWithPagination = {
    searchItem: string;
    pageIndex: number;
};
export type GetCommentsWithPaginationByLectureId = {
    pageIndex: number;
};
export type Comment = {
    comment_id: number;
    content: string;
    updatedAt: string;
    user: OwnerComment;
    lecture_id: number;
    likes_count: number;
    dislikes_count: number;
    replyCommentLectures: ReplyComment;
    likes: Like[];
    dislikes: Dislike[];
}
export type CreateUpdateComment = {
    id: number;
    content: string;
    created_at: string
    updatedAt: string;
    user_id: number;
    lecture_id: number;
    likes_count: number;
    dislikes_count: number;
}


import { OwnerReply } from "./user"

export type Like = {
    like_id: number,
    user: OwnerReply;
    comment_id: number;
    reply_id: number | null;
    updatedAt: string;
}

import { GetCommentsWithPagination } from "@/types/comment";
import apiCaller from "../api-config/apiCaller";

const createReplyComment = async (content: string, comment_id: number)=> {
    const path ="reply/";
    const reponse = await apiCaller("POST", path, {content, comment_id});
    return reponse;
};
const updateReplyComment = async (reply_id: number, content: string )=> {
    const path =`reply/${reply_id}`;
    const reponse = await apiCaller("PATCH", path , {content});
    return reponse;
};
const deleteReplyComment = async (reply_id: number)=> {
    const path =`reply/${reply_id}`;
    const reponse = await apiCaller("DELETE", path);
    return reponse;
};
const getReplyCommentsWithPagination = async (values: GetCommentsWithPagination) => {
    const path = `reply/all?search_item=${values.searchItem}&page_index=${values.pageIndex}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const replyCommentApis = {
    createReplyComment,
    updateReplyComment,
    deleteReplyComment,
    getReplyCommentsWithPagination,
};

export default replyCommentApis;
import { GetCommentsWithPagination, GetCommentsWithPaginationByLectureId } from "@/types/comment";
import apiCaller from "../api-config/apiCaller";

const createComment = async (lecture_id:number, content: string)=> {
    const path ="comment/";
    const reponse = await apiCaller("POST", path, {lecture_id, content});
    return reponse;
};
const updateComment = async (comment_id: number, content: string)=> {
    const path =`comment/${comment_id}`;
    const reponse = await apiCaller("PATCH", path, {content} );
    return reponse;
};
const deleteComment = async (comment_id: number)=> {
    const path =`comment/${comment_id}`;
    const reponse = await apiCaller("DELETE", path);
    return reponse;
};
const getCommentsWithPagination = async (values: GetCommentsWithPagination) => {
    const path = `comment/all?search_item=${values.searchItem}&page_index=${values.pageIndex}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getCommentsWithPaginationByLectureId = async (lecture_id: number, values: GetCommentsWithPaginationByLectureId) => {
    const path = `comment/${lecture_id}?page_index=${values.pageIndex}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const commentApis = {
    createComment,
    updateComment,
    deleteComment,
    getCommentsWithPagination,
    getCommentsWithPaginationByLectureId,
};

export default commentApis;
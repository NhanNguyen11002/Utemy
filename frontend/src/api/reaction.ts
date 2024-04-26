import apiCaller from "../api-config/apiCaller";

const createLike = async(comment_id: number, reply_id: number | null)=> {
    const path =`reaction/like/`;
    const reponse = await apiCaller("POST", path, {comment_id, reply_id});
    return reponse;
};
const deleteLike = async(comment_id: number, reply_id: number | null)=> {
    const path =`reaction/like/`;
    const reponse = await apiCaller("DELETE", path, {comment_id, reply_id});
    return reponse;
};
const createDislike = async (comment_id: number, reply_id: number | null)=> {
    const path =`reaction/dislike/`;
    const reponse = await apiCaller("POST", path, {comment_id, reply_id});
    return reponse;
};
const deleteDislike = async (comment_id: number, reply_id: number | null)=> {
    const path =`reaction/dislike/`;
    const reponse = await apiCaller("DELETE", path, {comment_id, reply_id});
    return reponse;
};
const checkLikeExist = async (comment_id: number, reply_id: number | null)=> {
    const path =`reaction/like/`;
    const reponse = await apiCaller("GET", path, {comment_id, reply_id});
    return reponse;
};
const checkDislikeExist = async (comment_id: number, reply_id: number | null)=> {
    const path =`reaction/dislike/`;
    const reponse = await apiCaller("GET", path, {comment_id, reply_id});
    return reponse;
};
const reactionApis = {
    createLike,
    deleteLike,
    createDislike,
    deleteDislike,
    checkLikeExist,
    checkDislikeExist,
};

export default reactionApis;
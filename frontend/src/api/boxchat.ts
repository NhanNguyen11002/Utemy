import apiCaller from "../api-config/apiCaller";
const submitQuestion = async (content: string) => {
    const path = "boxchat/";

    const reponse = await apiCaller("POST", path, {content});
    return reponse;
};
const checkValidateComment = async (content: string) => {
    const path = "boxchat/check";

    const reponse = await apiCaller("POST", path, {content});
    return reponse;
};
const boxChatApis ={submitQuestion, checkValidateComment};
export default boxChatApis;

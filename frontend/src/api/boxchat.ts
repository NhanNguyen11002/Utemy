import apiCaller from "../api-config/apiCaller";
const submitQuestion = async (content: string) => {
    const path = "boxchat/";

    const reponse = await apiCaller("POST", path, {content});
    return reponse;
};
const boxChatApis ={submitQuestion};
export default boxChatApis;

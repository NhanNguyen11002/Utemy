import apiCaller from "../api-config/apiCaller";
import { QuizGroupType, QuizType, GetAllQuizInGroup, QuizGroupCreateType } from "../types/quiz";

const createQuizGroup = async (values: QuizGroupCreateType) => {
    const path = "quiz/group";
    const reponse = await apiCaller("POST", path, values);
    return reponse;
};
const updateQuizGroup = async (values: QuizGroupType) => {
    const path = `quiz/group/${values.quiz_group_id}`;
    const data = {
        title: values.title,
        description: values.description,
    };
    const reponse = await apiCaller("PATCH", path, data);
    return reponse;
};
const deleteQuizGroup = async (values: number) => {
    const path = `quiz/group/${values}`;
    const reponse = await apiCaller("DELETE", path);
    return reponse;
};
const createQuiz = async (values: QuizType) => {
    const path = "quiz/";
    const reponse = await apiCaller("POST", path, values);
    return reponse;
};
const updateQuiz = async (values: QuizType) => {
    const path = `quiz/${values.quiz_id}`;
    const data = {
        question: values.question,
        type: values.type,
        quiz_answer: values.quiz_answer,
    };
    const reponse = await apiCaller("PATCH", path, data);
    return reponse;
};
const deleteQuiz = async (values: number) => {
    const path = `quiz/${values}`;
    const reponse = await apiCaller("DELETE", path);
    return reponse;
};
const getAllQuizByGroupId = async (values: GetAllQuizInGroup) => {
    const path = `quiz/${values.quiz_group_id}?search_item=${values.searchItem}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getAllQuizGroup = async () => {
    const path = `quiz/group`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const quizApis = {
    createQuizGroup,
    updateQuizGroup,
    deleteQuizGroup,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    getAllQuizByGroupId,
    getAllQuizGroup,
};

export default quizApis;

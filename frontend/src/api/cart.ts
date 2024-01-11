import apiCaller from "../api-config/apiCaller";

const getAllCart = async () => {
    const path = "cart/";
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const addCourseToCart = async (values: number) => {
    const path = "cart/";
    const data = {
        course_id: values,
    };
    const reponse = await apiCaller("POST", path, data);
    return reponse;
};
const removeCourseFromCart = async (values: number) => {
    const path = `cart/${values}`;
    const reponse = await apiCaller("DELETE", path);
    return reponse;
};
const changeSaveForLater = async (values: number) => {
    const path = `cart/${values}`;
    const reponse = await apiCaller("PATCH", path);
    return reponse;
};

const cartApis = {
    getAllCart,
    addCourseToCart,
    changeSaveForLater,
    removeCourseFromCart,
};

export default cartApis;

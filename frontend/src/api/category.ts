import apiCaller from "../api-config/apiCaller";
import { GetCategoriesWithPagination } from "../types/category";

const get5Categories = async () => {
    const path = "category/top5";

    const reponse = await apiCaller("GET", path);
    return reponse;
};
const get8BlogCategories = async () => {
    const path = "category/top8blog";

    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getCategories = async () => {
    const path = "category/full";

    const reponse = await apiCaller("GET", path);
    return reponse;
};
const createCategory = async (values: FormData) => {
    const path = "category";

    const reponse = await apiCaller("POST", path, values);
    return reponse;
};
const editCategory = async (values: FormData) => {
    const path = "category";

    const reponse = await apiCaller("PATCH", path, values);
    return reponse;
};
const deleteCategory = async (values: number) => {
    const path = `category/${values}`;

    const reponse = await apiCaller("DELETE", path);
    return reponse;
};
const getCategory = async (values: number) => {
    const path = `category/${values}`;

    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getCategoriesWithPagination = async (values: GetCategoriesWithPagination) => {
    const path = `category/all?search_item=${values.searchItem}&page_index=${values.pageIndex}`;

    const reponse = await apiCaller("GET", path);
    return reponse;
};

const categoryApis = {
    get5Categories,
    getCategories,
    createCategory,
    getCategoriesWithPagination,
    deleteCategory,
    getCategory,
    editCategory,
    get8BlogCategories,
};

export default categoryApis;

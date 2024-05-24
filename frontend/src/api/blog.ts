import apiCaller from "../api-config/apiCaller";
import { GetBlogsWithPagination } from "../types/blog";

const getBlogs = async () => {
    const path = "blog/full";

    const reponse = await apiCaller("GET", path);
    return reponse;
};
const createBlog = async (values: FormData) => {
    const path = "blog/";

    const reponse = await apiCaller("POST", path, values);
    return reponse;
};
const updateBlog = async (values: FormData) => {
    const path = "blog/";

    const reponse = await apiCaller("PATCH", path, values);
    return reponse;
};
const deleteBlog = async (values: number) => {
    const path = `blog/${values}`;

    const reponse = await apiCaller("DELETE", path);
    return reponse;
};
const getBlog = async (values: number) => {
    const path = `blog/${values}`;

    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getBlogsWithPagination = async (values: GetBlogsWithPagination) => {
    const path = `blog/all?search_item=${values.searchItem}&page_index=${values.pageIndex}`;

    const reponse = await apiCaller("GET", path);
    return reponse;
};

const blogApis = {
    getBlogs,
    createBlog,
    getBlogsWithPagination,
    deleteBlog,
    getBlog,
    updateBlog,
};

export default blogApis;

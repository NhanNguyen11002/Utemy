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
const deleteBlog = async (values: string) => {
    const path = `blog/${values}`;

    const reponse = await apiCaller("DELETE", path);
    return reponse;
};
const togglePublishedBlog = async (values: any) => {
    const path = `blog/${values.slug}`;
    const data = {
        published: values.published,
    };
    const reponse = await apiCaller("patch", path, data);
    return reponse;
};
const getBlog = async (values: string) => {
    const path = `blog/${values}`;

    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getBlogsWithPagination = async (values: GetBlogsWithPagination) => {
    let categoryParams = "";
    values.category?.forEach((temp) => {
        categoryParams += `&category=${temp}`;
    });
    const path = `blog/all?search_item=${values.searchItem}&page_index=${values.pageIndex}${categoryParams}`;

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
    togglePublishedBlog,
};

export default blogApis;

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
const searchBlogUserWithPagination = async (values: GetBlogsWithPagination) => {
    let categoryParams = "";
    values.category?.forEach((temp) => {
        categoryParams += `&category=${temp}`;
    });
    const path = `blog/search?search_item=${values.searchItem}&page_index=${values.pageIndex}${categoryParams}`;

    const reponse = await apiCaller("GET", path);
    return reponse;
};
const getNewestBlogWithPagination = async (values: number) => {
    const path = `blog/newest?page_index=${values}`;

    const reponse = await apiCaller("GET", path);
    return reponse;
};
const top10Like = async () => {
    const path = `blog/top10like`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const top10View = async () => {
    const path = `blog/top10view`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const top5RelatedBySlug = async (values: string) => {
    const path = `blog/related/${values}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const reactBlog = async (values: any) => {
    const path = `blog/react`;
    const data = {
        blog_id: values.blog_id,
        reaction_type: values.reaction_type,
    };
    const reponse = await apiCaller("POST", path, data);
    return reponse;
};
const getUserReactBySlug = async (values: string) => {
    const path = `blog/react/${values}`;
    const reponse = await apiCaller("GET", path);
    return reponse;
};
const increaseViewBlog = async (values: string) => {
    const path = `blog/view/${values}`;
    const reponse = await apiCaller("POST", path);
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
    searchBlogUserWithPagination,
    top10Like,
    top10View,
    getNewestBlogWithPagination,
    top5RelatedBySlug,
    reactBlog,
    getUserReactBySlug,
    increaseViewBlog,
};

export default blogApis;

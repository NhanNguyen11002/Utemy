import { Response } from "../../types/response";
import { Blog, GetBlogsWithPagination } from "../../types/blog";
import apis from "../../api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getBlogs = createAsyncThunk<Response<Blog[]>, void, { rejectValue: Response<null> }>(
    "blog/full",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.blogApis.getBlogs();
            return response.data as Response<Blog[]>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const createBlog = createAsyncThunk<Response<null>, FormData, { rejectValue: Response<null> }>(
    "blog/create",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.blogApis.createBlog(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const updateBlog = createAsyncThunk<Response<null>, FormData, { rejectValue: Response<null> }>(
    "blog/update",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.blogApis.updateBlog(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const deleteBlog = createAsyncThunk<Response<null>, string, { rejectValue: Response<null> }>(
    "blog/delete",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.blogApis.deleteBlog(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const togglePublishedBlog = createAsyncThunk<Response<null>, any, { rejectValue: Response<null> }>(
    "blog/toggle-public",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.blogApis.togglePublishedBlog(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getBlog = createAsyncThunk<Response<null>, string, { rejectValue: Response<null> }>(
    "blog/get",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.blogApis.getBlog(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getBlogsWithPagination = createAsyncThunk<
    Response<null>,
    GetBlogsWithPagination,
    { rejectValue: Response<null> }
>("blog/all", async (body, ThunkAPI) => {
    try {
        const response = await apis.blogApis.getBlogsWithPagination(body);
        return response.data as Response<null>;
    } catch (error: any) {
        return ThunkAPI.rejectWithValue(error.data as Response<null>);
    }
});
type BlogSliceType = {
    blog: Blog;
    blogs: Blog[];
    totalPage: number;
    totalRecord: number;
    isLoading: boolean;
    isGetLoading: boolean;
};

const initialState: BlogSliceType = {
    blogs: [],
    blog: {
        blog_id: 0,
        title: "",
        url_image: "",
        content: "",
        author: {
            first_name: "",
            last_name: "",
            email: "",
            url_avatar: "",
            user_id: undefined,
            description: "",
            is_admin: false,
        },
        categories: [],
        is_published: false,
        slug: "",
    },
    totalPage: 0,
    totalRecord: 0,
    isLoading: false,
    isGetLoading: false,
};
export const blogSlice = createSlice({
    name: "blog",
    initialState,
    reducers: {
        setBlog: (state, action) => {
            state.blog = action.payload;
        },
        setBlogPublished: (state, action) => {
            state.blog.is_published = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getBlogs.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getBlogs.fulfilled, (state, action) => {
            state.blogs = action.payload.data as Blog[];
            state.isGetLoading = false;
        });
        builder.addCase(getBlogs.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(createBlog.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(createBlog.fulfilled, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(createBlog.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(getBlogsWithPagination.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getBlogsWithPagination.fulfilled, (state, action: any) => {
            state.blogs = action.payload.data?.data as Blog[];
            state.totalPage = action.payload.data.total_page;
            state.totalRecord = action.payload.data.total_record;
            state.isGetLoading = false;
        });
        builder.addCase(getBlogsWithPagination.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(deleteBlog.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(deleteBlog.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(deleteBlog.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(togglePublishedBlog.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(togglePublishedBlog.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(togglePublishedBlog.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(getBlog.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getBlog.fulfilled, (state, action: any) => {
            state.blog = action.payload.data as Blog;
            state.isGetLoading = false;
        });
        builder.addCase(getBlog.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(updateBlog.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(updateBlog.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(updateBlog.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

export const { setBlog, setBlogPublished } = blogSlice.actions;

export default blogSlice.reducer;

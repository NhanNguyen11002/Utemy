import { Response } from "../../types/response";
import { Category, GetCategoriesWithPagination } from "../../types/category";
import apis from "../../api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const get5Categories = createAsyncThunk<Response<Category[]>, void, { rejectValue: Response<null> }>(
    "category/top5",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.categoryApis.get5Categories();
            return response.data as Response<Category[]>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getCategories = createAsyncThunk<Response<Category[]>, void, { rejectValue: Response<null> }>(
    "category/full",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.categoryApis.getCategories();
            return response.data as Response<Category[]>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const createCategory = createAsyncThunk<Response<null>, FormData, { rejectValue: Response<null> }>(
    "category/create",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.categoryApis.createCategory(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const editCategory = createAsyncThunk<Response<null>, FormData, { rejectValue: Response<null> }>(
    "category/edit",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.categoryApis.editCategory(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const deleteCategory = createAsyncThunk<Response<null>, number, { rejectValue: Response<null> }>(
    "category/delete",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.categoryApis.deleteCategory(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getCategory = createAsyncThunk<Response<null>, number, { rejectValue: Response<null> }>(
    "category/get",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.categoryApis.getCategory(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getCategoriesWithPagination = createAsyncThunk<
    Response<null>,
    GetCategoriesWithPagination,
    { rejectValue: Response<null> }
>("category/all", async (body, ThunkAPI) => {
    try {
        const response = await apis.categoryApis.getCategoriesWithPagination(body);
        return response.data as Response<null>;
    } catch (error: any) {
        return ThunkAPI.rejectWithValue(error.data as Response<null>);
    }
});
type CategorySliceType = {
    category: Category;
    top5categories: Category[];
    categories: Category[];
    totalPage: number;
    totalRecord: number;
    isLoading: boolean;
    isGetLoading: boolean;
};

const initialState: CategorySliceType = {
    top5categories: [],
    categories: [],
    category: {
        category_id: 0,
        title: "",
        url_image: "",
        description: "",
    },
    totalPage: 0,
    totalRecord: 0,
    isLoading: false,
    isGetLoading: false,
};
export const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        setCategory: (state, action) => {
            state.category = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(get5Categories.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(get5Categories.fulfilled, (state, action) => {
            state.top5categories = action.payload.data as Category[];
            state.isGetLoading = false;
        });
        builder.addCase(get5Categories.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getCategories.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getCategories.fulfilled, (state, action) => {
            state.categories = action.payload.data as Category[];
            state.isGetLoading = false;
        });
        builder.addCase(getCategories.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(createCategory.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(createCategory.fulfilled, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(createCategory.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(getCategoriesWithPagination.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getCategoriesWithPagination.fulfilled, (state, action: any) => {
            state.categories = action.payload.data?.data as Category[];
            state.totalPage = action.payload.data.total_page;
            state.totalRecord = action.payload.data.total_record;
            state.isGetLoading = false;
        });
        builder.addCase(getCategoriesWithPagination.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(deleteCategory.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(deleteCategory.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(deleteCategory.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(getCategory.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getCategory.fulfilled, (state, action: any) => {
            state.category = action.payload.data as Category;
            state.isGetLoading = false;
        });
        builder.addCase(getCategory.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(editCategory.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(editCategory.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(editCategory.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

export const { setCategory } = categorySlice.actions;

export default categorySlice.reducer;

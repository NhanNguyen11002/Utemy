import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Rating, RatingCourse, GetRating, ListRating, EditRating } from "../../types/rating";
import { RatingPercent } from "../../types/statistic";
import { Response } from "../../types/response";
import apis from "../../api";

type RatingSliceType = {
    ratings: Rating[];
    rating: Rating;
    ratingPercent: RatingPercent[];
    totalRecord: number;
    totalPage: number;
    isLoading: boolean;
    isGetLoading: boolean;
};

const initialState: RatingSliceType = {
    ratings: [],
    ratingPercent: [],
    rating: {
        id: undefined,
        score: undefined,
        content: "",
        created_at: "",
        url_avatar: "",
        first_name: "",
        last_name: "",
        user_id: 0,
    },
    totalRecord: 0,
    totalPage: 0,
    isLoading: false,
    isGetLoading: false,
};
export const ratingCourse = createAsyncThunk<Response<null>, RatingCourse, { rejectValue: Response<null> }>(
    "rating/create",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.ratingApis.ratingCourse(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const editRating = createAsyncThunk<Response<null>, EditRating, { rejectValue: Response<null> }>(
    "rating/edit",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.ratingApis.editRating(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const deleteRating = createAsyncThunk<Response<null>, number, { rejectValue: Response<null> }>(
    "rating/delete",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.ratingApis.deleteRating(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getUserRating = createAsyncThunk<Response<Rating>, number, { rejectValue: Response<null> }>(
    "rating/user",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.ratingApis.getUserRating(body);
            return response.data as Response<Rating>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getListRatingOfCourseBySlug = createAsyncThunk<
    Response<ListRating>,
    GetRating,
    { rejectValue: Response<null> }
>("rating/all", async (body, ThunkAPI) => {
    try {
        const response = await apis.ratingApis.getListRatingOfCourseBySlug(body);
        return response.data as Response<ListRating>;
    } catch (error: any) {
        return ThunkAPI.rejectWithValue(error.data as Response<null>);
    }
});

export const getRatingPercentOfCourse = createAsyncThunk<
    Response<RatingPercent[]>,
    string,
    { rejectValue: Response<null> }
>("rating/percent", async (body, ThunkAPI) => {
    try {
        const response = await apis.ratingApis.getRatingPercentOfCourse(body);
        return response.data as Response<RatingPercent[]>;
    } catch (error: any) {
        return ThunkAPI.rejectWithValue(error.data as Response<null>);
    }
});
export const ratingSlice = createSlice({
    name: "rating",
    initialState,
    reducers: {
        setDeleteRating: (state) => {
            state.rating = initialState.rating;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(ratingCourse.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(ratingCourse.fulfilled, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(ratingCourse.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(getListRatingOfCourseBySlug.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getListRatingOfCourseBySlug.fulfilled, (state, action) => {
            state.ratings = action.payload.data?.data as Rating[];
            state.totalPage = action.payload.data?.total_page as number;
            state.isGetLoading = false;
        });
        builder.addCase(getListRatingOfCourseBySlug.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getRatingPercentOfCourse.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getRatingPercentOfCourse.fulfilled, (state, action) => {
            state.ratingPercent = action.payload.data as RatingPercent[];
            state.isGetLoading = false;
        });
        builder.addCase(getRatingPercentOfCourse.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getUserRating.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getUserRating.fulfilled, (state, action) => {
            state.rating = action.payload.data as Rating;
            state.isGetLoading = false;
        });
        builder.addCase(getUserRating.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(editRating.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(editRating.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(editRating.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(deleteRating.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(deleteRating.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(deleteRating.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

export const { setDeleteRating } = ratingSlice.actions;

export default ratingSlice.reducer;

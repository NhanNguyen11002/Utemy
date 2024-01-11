import { Response } from "../../types/response";
import apis from "../../api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CategoryCourse, CategoryEnrolled, CategoryMoney, MoneyByMonth, RatingPercent } from "../../types/statistic";

export const getTotalUser = createAsyncThunk<Response<any>, void, { rejectValue: Response<null> }>(
    "stat/total-user",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.statisticApis.getTotalUser();
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getTotalMoney = createAsyncThunk<Response<any>, void, { rejectValue: Response<null> }>(
    "stat/total-money",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.statisticApis.getTotalMoney();
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getTotalCourse = createAsyncThunk<Response<any>, void, { rejectValue: Response<null> }>(
    "stat/total-course",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.statisticApis.getTotalCourse();
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getTotalInvoice = createAsyncThunk<Response<any>, void, { rejectValue: Response<null> }>(
    "stat/total-invoice",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.statisticApis.getTotalInvoice();
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getCategoryCourse = createAsyncThunk<Response<CategoryCourse[]>, void, { rejectValue: Response<null> }>(
    "stat/cate-course",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.statisticApis.getCategoryCourse();
            return response.data as Response<CategoryCourse[]>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getCategoryEnrolled = createAsyncThunk<
    Response<CategoryEnrolled[]>,
    void,
    { rejectValue: Response<null> }
>("stat/cate-enrolled", async (body, ThunkAPI) => {
    try {
        const response = await apis.statisticApis.getCategoryEnrolled();
        return response.data as Response<CategoryEnrolled[]>;
    } catch (error: any) {
        return ThunkAPI.rejectWithValue(error.data as Response<null>);
    }
});
export const getCategoryMoney = createAsyncThunk<Response<CategoryMoney[]>, void, { rejectValue: Response<null> }>(
    "stat/cate-money",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.statisticApis.getCategoryMoney();
            return response.data as Response<CategoryMoney[]>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getRatingPercent = createAsyncThunk<Response<RatingPercent[]>, void, { rejectValue: Response<null> }>(
    "stat/rating-percent",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.statisticApis.getRatingPercent();
            return response.data as Response<RatingPercent[]>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getMoneyByMonth = createAsyncThunk<Response<MoneyByMonth[]>, number, { rejectValue: Response<null> }>(
    "stat/month-money",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.statisticApis.getMoneyByMonth(body);
            return response.data as Response<MoneyByMonth[]>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);

type StatisticSliceType = {
    totalMoney: number;
    totalCourse: number;
    totalUser: number;
    totalInvoice: number;
    categoryCourse: CategoryCourse[];
    categoryEnrolled: CategoryEnrolled[];
    categoryMoney: CategoryMoney[];
    ratingPercent: RatingPercent[];
    moneyByMonth: MoneyByMonth[];

    isGetLoading: boolean;
};

const initialState: StatisticSliceType = {
    totalMoney: 0,
    totalCourse: 0,
    totalUser: 0,
    totalInvoice: 0,
    categoryCourse: [],
    categoryEnrolled: [],
    categoryMoney: [],
    ratingPercent: [],
    moneyByMonth: [],
    isGetLoading: false,
};

export const statisticSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getTotalUser.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getTotalUser.fulfilled, (state, action) => {
            state.totalUser = action.payload.data.total_user;
            state.isGetLoading = false;
        });
        builder.addCase(getTotalUser.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getTotalInvoice.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getTotalInvoice.fulfilled, (state, action) => {
            state.totalInvoice = action.payload.data.total_invoice;
            state.isGetLoading = false;
        });
        builder.addCase(getTotalInvoice.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getTotalMoney.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getTotalMoney.fulfilled, (state, action) => {
            state.totalMoney = action.payload.data.total_money;
            state.isGetLoading = false;
        });
        builder.addCase(getTotalMoney.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getTotalCourse.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getTotalCourse.fulfilled, (state, action) => {
            state.totalCourse = action.payload.data.course_count;
            state.isGetLoading = false;
        });
        builder.addCase(getTotalCourse.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getCategoryCourse.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getCategoryCourse.fulfilled, (state, action) => {
            state.categoryCourse = action.payload.data as CategoryCourse[];
            state.isGetLoading = false;
        });
        builder.addCase(getCategoryCourse.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getCategoryMoney.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getCategoryMoney.fulfilled, (state, action) => {
            state.categoryMoney = action.payload.data as CategoryMoney[];
            state.isGetLoading = false;
        });
        builder.addCase(getCategoryMoney.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getCategoryEnrolled.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getCategoryEnrolled.fulfilled, (state, action) => {
            state.categoryEnrolled = action.payload.data as CategoryEnrolled[];
            state.isGetLoading = false;
        });
        builder.addCase(getCategoryEnrolled.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getMoneyByMonth.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getMoneyByMonth.fulfilled, (state, action) => {
            state.moneyByMonth = action.payload.data as MoneyByMonth[];
            state.isGetLoading = false;
        });
        builder.addCase(getMoneyByMonth.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getRatingPercent.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getRatingPercent.fulfilled, (state, action) => {
            state.ratingPercent = action.payload.data as RatingPercent[];
            state.isGetLoading = false;
        });
        builder.addCase(getRatingPercent.rejected, (state) => {
            state.isGetLoading = false;
        });
    },
});

export const {} = statisticSlice.actions;

export default statisticSlice.reducer;

import { Response } from "../../types/response";
import apis from "../../api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CategoryCourse, CategoryEnrolled, CategoryMoney, MoneyByMonth, RatingPercent, EnrollByMonth, CourseCountStat, IncomeByCourse, EnrollStat } from "../../types/statistic";
import { Course } from "../../types/course";

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



export const getCourseCountByOwner = createAsyncThunk<Response<CourseCountStat>, void, { rejectValue: Response<null> }>(
    "stat/total-course-owner",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.statisticApis.getCourseCountByOwner();
            return response.data as Response<CourseCountStat>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getTop5EnrolledCourseByOwner = createAsyncThunk<Response<Course[]>, void, { rejectValue: Response<null> }>(
    "stat/total-course-top5-enrolled",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.statisticApis.getTop5EnrolledCourseByOwner();
            return response.data as Response<Course[]>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getTop5RateCourseByOwner = createAsyncThunk<Response<Course[]>, void, { rejectValue: Response<null> }>(
    "stat/total-course-top5-rate",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.statisticApis.getTop5RateCourseByOwner();
            return response.data as Response<Course[]>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getIncomeByOwner = createAsyncThunk<Response<any>, void, { rejectValue: Response<null> }>(
    "stat/income-by-owner",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.statisticApis.getIncomeByOwner();
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getIncomeByCourseByOwner = createAsyncThunk<Response<IncomeByCourse[]>, void, { rejectValue: Response<null> }>(
    "stat/income-by-course-by-owner",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.statisticApis.getIncomeByCourseByOwner();
            return response.data as Response<IncomeByCourse[]>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getIncomeByMonthByOwner = createAsyncThunk<Response<MoneyByMonth[]>, number, { rejectValue: Response<null> }>(
    "stat/month-income",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.statisticApis.getIncomeByMonthByOwner(body);
            return response.data as Response<MoneyByMonth[]>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getTotalEnrolledByOwner = createAsyncThunk<Response<any>, void, { rejectValue: Response<null> }>(
    "stat/total-enrolled",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.statisticApis.getTotalEnrolledByOwner();
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getEnrolledByTimeByOwner = createAsyncThunk<Response<any>, {period: string, startDate: string, endDate: string}, { rejectValue: Response<null> }>(
    "stat/total-enrolled-by-time",
    async ({period, startDate, endDate}, ThunkAPI) => {
        try {
            const response = await apis.statisticApis.getEnrolledByTimeByOwner(period, startDate, endDate);
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getEnrolledByMonthByOwner = createAsyncThunk<Response<EnrollByMonth[]>, number, { rejectValue: Response<null> }>(
    "stat/month-enrolled",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.statisticApis.getEnrolledByMonthByOwner(body);
            return response.data as Response<EnrollByMonth[]>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getTotalIncomeSaleCourse = createAsyncThunk<Response<any>, void, { rejectValue: Response<null> }>(
    "stat/income-sale-course",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.statisticApis.getTotalIncomeSaleCourse();
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getTotalIncomeOriginCourse = createAsyncThunk<Response<any>, void, { rejectValue: Response<null> }>(
    "stat/income-origin-course",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.statisticApis.getTotalIncomeOriginCourse();
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getTotalPassUnpass = createAsyncThunk<Response<EnrollStat>, void, { rejectValue: Response<null> }>(
    "stat/total-pass-unpass",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.statisticApis.getTotalPassUnpass();
            return response.data as Response<EnrollStat>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getAvgRateAllCourse = createAsyncThunk<Response<any>, void, { rejectValue: Response<null> }>(
    "stat/avg-rate-all-course",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.statisticApis.getAvgRateAllCourse();
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getTotalTurnRating = createAsyncThunk<Response<any>, void, { rejectValue: Response<null> }>(
    "stat/total-turn-rating",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.statisticApis.getTotalTurnRating();
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getRatingPercentByOwner = createAsyncThunk<Response<RatingPercent[]>, void, { rejectValue: Response<null> }>(
    "stat/rating-percent-by-owner",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.statisticApis.getRatingPercentByOwner();
            return response.data as Response<RatingPercent[]>;
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
    incomeByMonth: MoneyByMonth[];
    enrollByMonth: EnrollByMonth[];
    totalIncomeByOwner: number;
    totalEnrollByOwner: number;
    courseCountStat: CourseCountStat;
    top5Enrolled: Course[];
    top5Rate: Course[];
    isGetLoading: boolean;
    incomeByCourse: IncomeByCourse[];
    totalIncomeSaleCourse: number;
    totalIncomeOriginCourse: number;
    totalPassUnpass: EnrollStat;
    avgRateAllCourse: number;
    totalTurnRating: number;
    ratingPercentByOwner: RatingPercent[];

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
    incomeByMonth: [],
    enrollByMonth: [],
    totalIncomeByOwner: 0,
    totalEnrollByOwner: 0,
    courseCountStat: {
        course_count: 0,
        course_approve_count: 0,
        course_not_approve_count: 0
    },
    top5Enrolled: [],
    top5Rate: [],
    incomeByCourse: [],
    totalIncomeSaleCourse: 0,
    totalIncomeOriginCourse: 0,
    avgRateAllCourse: 0,
    totalTurnRating: 0,
    ratingPercentByOwner: [],
    totalPassUnpass: {
        total_enrolled: 0,
        total_pass: 0,
        total_unpass: 0
    }
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



        builder.addCase(getIncomeByMonthByOwner.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getIncomeByMonthByOwner.fulfilled, (state, action) => {
            state.incomeByMonth = action.payload.data as MoneyByMonth[];
            state.isGetLoading = false;
        });
        builder.addCase(getIncomeByMonthByOwner.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getEnrolledByMonthByOwner.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getEnrolledByMonthByOwner.fulfilled, (state, action) => {
            state.enrollByMonth = action.payload.data as EnrollByMonth[];
            state.isGetLoading = false;
        });
        builder.addCase(getEnrolledByMonthByOwner.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getIncomeByOwner.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getIncomeByOwner.fulfilled, (state, action) => {
            state.totalIncomeByOwner = action.payload.data.total_money;
            state.isGetLoading = false;
        });
        builder.addCase(getIncomeByOwner.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getTotalEnrolledByOwner.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getTotalEnrolledByOwner.fulfilled, (state, action) => {
            state.totalEnrollByOwner = action.payload.data.enrolled_count;
            state.isGetLoading = false;
        });
        builder.addCase(getTotalEnrolledByOwner.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getTop5RateCourseByOwner.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getTop5RateCourseByOwner.fulfilled, (state, action) => {
            state.top5Rate = action.payload.data as Course[];
            state.isGetLoading = false;
        });
        builder.addCase(getTop5RateCourseByOwner.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getTop5EnrolledCourseByOwner.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getTop5EnrolledCourseByOwner.fulfilled, (state, action) => {
            state.top5Enrolled = action.payload.data as Course[];
            state.isGetLoading = false;
        });
        builder.addCase(getTop5EnrolledCourseByOwner.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getCourseCountByOwner.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getCourseCountByOwner.fulfilled, (state, action) => {
            state.courseCountStat = action.payload.data as CourseCountStat;
            state.isGetLoading = false;
        });
        builder.addCase(getCourseCountByOwner.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getIncomeByCourseByOwner.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getIncomeByCourseByOwner.fulfilled, (state, action) => {
            state.incomeByCourse = action.payload.data as IncomeByCourse[];
            state.isGetLoading = false;
        });
        builder.addCase(getIncomeByCourseByOwner.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getTotalIncomeSaleCourse.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getTotalIncomeSaleCourse.fulfilled, (state, action) => {
            state.totalIncomeSaleCourse = action.payload.data.total_money;
            state.isGetLoading = false;
        });
        builder.addCase(getTotalIncomeSaleCourse.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getTotalIncomeOriginCourse.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getTotalIncomeOriginCourse.fulfilled, (state, action) => {
            state.totalIncomeOriginCourse = action.payload.data.total_money;
            state.isGetLoading = false;
        });
        builder.addCase(getTotalIncomeOriginCourse.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getTotalPassUnpass.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getTotalPassUnpass.fulfilled, (state, action) => {
            state.totalPassUnpass = action.payload.data as EnrollStat;
            state.isGetLoading = false;
        });
        builder.addCase(getTotalPassUnpass.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getAvgRateAllCourse.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getAvgRateAllCourse.fulfilled, (state, action) => {
            state.avgRateAllCourse = action.payload.data.average_rating;
            state.isGetLoading = false;
        });
        builder.addCase(getAvgRateAllCourse.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getTotalTurnRating.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getTotalTurnRating.fulfilled, (state, action) => {
            state.totalTurnRating = action.payload.data.total_turn_rating;
            state.isGetLoading = false;
        });
        builder.addCase(getTotalTurnRating.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getRatingPercentByOwner.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getRatingPercentByOwner.fulfilled, (state, action) => {
            state.ratingPercentByOwner = action.payload.data as RatingPercent[];
            state.isGetLoading = false;
        });
        builder.addCase(getRatingPercentByOwner.rejected, (state) => {
            state.isGetLoading = false;
        });

    },
});

export const {} = statisticSlice.actions;

export default statisticSlice.reducer;

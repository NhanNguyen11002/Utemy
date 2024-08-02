import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Response } from "../../types/response";
import {
    Course,
    PagingCourse,
    SearchMyCourseEnrolledCourse,
    RightOfCourse,
    AddPromotion,
    SearchAllCourses,
    SearchAllCoursesResponse,
    UpdateTargetCourse,
    SearchAuthorCourse,
} from "../../types/course";
import apis from "../../api";
import { Approval } from "../../types/approval";
import { CreateTestType } from "../../types/test";

type CourseSliceType = {
    courseDetail: Course;
    courseDetailForTrial: Course;
    courses: Course[];
    top10Rate: Course[];
    top10Enrolled: Course[];
    top10Sale: Course[];
    totalPage: number;
    totalRecord: number;
    isLoading: boolean;
    isGetLoading: boolean;
    isUpload: boolean;
    role: string;
    myEnrolled: any;
    currentCertificate: string;
    isFirstPass: boolean;
};

const initialState: CourseSliceType = {
    courseDetail: {
        course_id: 0,
        title: "",
        slug: "",
        status: false,
        description: "",
        thumbnail: "",
        summary: "",
        number_of_section: 0,
        number_of_rating: 0,
        number_of_enrolled: 0,
        author: {
            first_name: "",
            last_name: "",
            email: "",
            url_avatar: "",
            user_id: undefined,
            description: "",
            is_admin: false,
        },
        price: 0,
        sale_price: 0,
        average_rating: 0,
        categories: [],
        sections: [],
        updated_at: "",
        requirement: "",
        study: "",
        approval: [],
        url_trailer: "",
        final_test_id: null,
        test: null,
    },
    courseDetailForTrial: {
        course_id: 0,
        title: "",
        slug: "",
        status: false,
        description: "",
        thumbnail: "",
        summary: "",
        number_of_section: 0,
        number_of_rating: 0,
        number_of_enrolled: 0,
        author: {
            first_name: "",
            last_name: "",
            email: "",
            url_avatar: "",
            user_id: undefined,
            description: "",
            is_admin: false,
        },
        price: 0,
        sale_price: 0,
        average_rating: 0,
        categories: [],
        sections: [],
        updated_at: "",
        requirement: "",
        study: "",
        approval: [],
        url_trailer: "",
    },
    role: "",
    top10Rate: [],
    top10Enrolled: [],
    top10Sale: [],
    courses: [],
    myEnrolled: {},
    totalPage: 0,
    totalRecord: 0,
    isLoading: false,
    isGetLoading: false,
    isUpload: false,
    currentCertificate: "",
    isFirstPass: false,
};
export const createCourses = createAsyncThunk<Response<null>, FormData, { rejectValue: Response<null> }>(
    "course/create",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.courseApis.createCourse(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const editCourse = createAsyncThunk<Response<null>, FormData, { rejectValue: Response<null> }>(
    "course/edit",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.courseApis.editCourse(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const addPromotion = createAsyncThunk<Response<null>, AddPromotion, { rejectValue: Response<null> }>(
    "course/promotion",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.courseApis.addPromotion(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const updateTargetCourse = createAsyncThunk<Response<null>, UpdateTargetCourse, { rejectValue: Response<null> }>(
    "course/promotion",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.courseApis.updateTargetCourse(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const stopPromotion = createAsyncThunk<Response<null>, number, { rejectValue: Response<null> }>(
    "course/stop-promotion",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.courseApis.stopPromotion(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getAllEnrolled = createAsyncThunk<Response<null>, void, { rejectValue: Response<null> }>(
    "course/enrolled-id",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.courseApis.getAllEnrolled();
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getMyCourses = createAsyncThunk<
    Response<PagingCourse>,
    SearchMyCourseEnrolledCourse,
    { rejectValue: Response<null> }
>("course/my", async (body, ThunkAPI) => {
    try {
        const response = await apis.courseApis.getMyCourses(body);
        return response.data as Response<PagingCourse>;
    } catch (error: any) {
        return ThunkAPI.rejectWithValue(error.data as Response<null>);
    }
});
export const getEnrolledCourses = createAsyncThunk<
    Response<PagingCourse>,
    SearchMyCourseEnrolledCourse,
    { rejectValue: Response<null> }
>("course/enrolled", async (body, ThunkAPI) => {
    try {
        const response = await apis.courseApis.getEnrolledCourses(body);
        return response.data as Response<PagingCourse>;
    } catch (error: any) {
        return ThunkAPI.rejectWithValue(error.data as Response<null>);
    }
});
export const getAllCourses = createAsyncThunk<
    Response<SearchAllCoursesResponse>,
    SearchAllCourses,
    { rejectValue: Response<null> }
>("course/all", async (body, ThunkAPI) => {
    try {
        const response = await apis.courseApis.getAllCourses(body);
        return response.data as Response<SearchAllCoursesResponse>;
    } catch (error: any) {
        return ThunkAPI.rejectWithValue(error.data as Response<null>);
    }
});
export const deleteCourse = createAsyncThunk<Response<null>, number, { rejectValue: Response<null> }>(
    "course/delete",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.courseApis.deleteCourse(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getCourseDetail = createAsyncThunk<Response<Course>, string, { rejectValue: Response<null> }>(
    "course/detail",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.courseApis.getCourseDetail(body);
            return response.data as Response<Course>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getCourseDetailForTrialLesson = createAsyncThunk<
    Response<Course>,
    string,
    { rejectValue: Response<null> }
>("course/trial/detail", async (body, ThunkAPI) => {
    try {
        const response = await apis.courseApis.getCourseDetailForTrialLesson(body);
        return response.data as Response<Course>;
    } catch (error: any) {
        return ThunkAPI.rejectWithValue(error.data as Response<null>);
    }
});
export const getCourseDetailById = createAsyncThunk<Response<Course>, number, { rejectValue: Response<null> }>(
    "course/detail-id",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.courseApis.getCourseDetailById(body);
            return response.data as Response<Course>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getRightOfCourse = createAsyncThunk<Response<RightOfCourse>, number, { rejectValue: Response<null> }>(
    "course/right",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.courseApis.getRightOfCourse(body);
            return response.data as Response<RightOfCourse>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getTop10Rate = createAsyncThunk<Response<Course[]>, void, { rejectValue: Response<null> }>(
    "course/top10",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.courseApis.getTop10Rate();
            return response.data as Response<Course[]>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getTop10Enrolled = createAsyncThunk<Response<Course[]>, void, { rejectValue: Response<null> }>(
    "course/top-enrolled",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.courseApis.getTop10Enrolled();
            return response.data as Response<Course[]>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getTop10Sale = createAsyncThunk<Response<Course[]>, void, { rejectValue: Response<null> }>(
    "course/top-sale",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.courseApis.getTop10Sales();
            return response.data as Response<Course[]>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const approveCourse = createAsyncThunk<Response<null>, number, { rejectValue: Response<null> }>(
    "course/approve",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.courseApis.approveCourse(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const restrictCourse = createAsyncThunk<Response<null>, number, { rejectValue: Response<null> }>(
    "course/restrict",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.courseApis.restrictCourse(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getCertificate = createAsyncThunk<Response<any>, number, { rejectValue: Response<null> }>(
    "course/certificate",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.courseApis.getCertificate(body);
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const createFinalTest = createAsyncThunk<Response<any>, CreateTestType, { rejectValue: Response<null> }>(
    "course/final/create",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.courseApis.createFinalTest(body);
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const updateFinalTest = createAsyncThunk<Response<any>, CreateTestType, { rejectValue: Response<null> }>(
    "course/final/update",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.courseApis.updateFinalTest(body);
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const deleteFinalTest = createAsyncThunk<Response<any>, number, { rejectValue: Response<null> }>(
    "course/final/delete",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.courseApis.deleteFinalTest(body);
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const setDoneCourse = createAsyncThunk<Response<any>, number, { rejectValue: Response<null> }>(
    "course/done",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.courseApis.setDoneCourse(body);
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getFinalTestByCourseId = createAsyncThunk<Response<any>, number, { rejectValue: Response<null> }>(
    "course/final/get",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.courseApis.getFinalTestByCourseId(body);
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getCourseByAuthorId = createAsyncThunk<Response<any>, SearchAuthorCourse, { rejectValue: Response<null> }>(
    "course/author/get",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.courseApis.getCourseByAuthorId(body);
            return response.data as Response<any>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const courseSlice = createSlice({
    name: "course",
    initialState,
    reducers: {
        setStudyAndRequirement: (state, action) => {
            state.courseDetail.study = action.payload.study;
            state.courseDetail.requirement = action.payload.requirement;
        },
        setSalePriceAndDate: (state, action) => {
            state.courseDetail.sale_price = action.payload.sale_price;
            state.courseDetail.sale_until = action.payload.sale_until;
        },
        setApprovalCourseDetail: (state, action) => {
            const approval = state.courseDetail.approval as Approval[];
            state.courseDetail.approval = [...approval, action.payload];
        },
        setCurrentCertificate: (state, action) => {
            state.currentCertificate = action.payload;
        },
        setIsFirstPass: (state, action) => {
            state.isFirstPass = action.payload;
        },
        setClearFinalTest: (state) => {
            state.courseDetail.test = null;
            state.courseDetail.final_test_id = null;
        },
        setPassCourse: (state, action) => {
            const courseId = action.payload;
            const currState = state.myEnrolled[courseId];
            if (!currState) return;
            const copy = { ...currState, is_pass: true };
            state.myEnrolled[courseId] = copy;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getMyCourses.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getMyCourses.fulfilled, (state, action) => {
            state.courses = action.payload.data?.data as Course[];
            state.totalPage = action.payload.data?.total_page as number;
            state.totalRecord = action.payload.data?.total_record as number;
            state.isLoading = false;
        });
        builder.addCase(getMyCourses.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(getEnrolledCourses.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getEnrolledCourses.fulfilled, (state, action) => {
            state.courses = action.payload.data?.data as Course[];
            state.totalPage = action.payload.data?.total_page as number;
            state.totalRecord = action.payload.data?.total_record as number;
            state.isLoading = false;
        });
        builder.addCase(getEnrolledCourses.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(getAllEnrolled.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getAllEnrolled.fulfilled, (state, action: any) => {
            let map: any = {};
            action.payload.data?.forEach((element: any) => {
                map[element.course_id] = element;
            });
            state.myEnrolled = map;
            state.isLoading = false;
        });
        builder.addCase(getAllEnrolled.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(getCourseDetail.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getCourseDetail.fulfilled, (state, action) => {
            state.courseDetail = action.payload.data as Course;
            const courseId = action.payload.data?.course_id;
            if (courseId) {
                const isFirstPass = state.myEnrolled[courseId] ? !state.myEnrolled[courseId].is_pass : false;
                state.isFirstPass = isFirstPass;
            }
            state.isGetLoading = false;
        });
        builder.addCase(getCourseDetail.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getCourseDetailForTrialLesson.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getCourseDetailForTrialLesson.fulfilled, (state, action) => {
            state.courseDetailForTrial = action.payload.data as Course;
            state.isGetLoading = false;
        });
        builder.addCase(getCourseDetailForTrialLesson.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getCourseDetailById.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getCourseDetailById.fulfilled, (state, action) => {
            state.courseDetail = action.payload.data as Course;
            state.isGetLoading = false;
        });
        builder.addCase(getCourseDetailById.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getRightOfCourse.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getRightOfCourse.fulfilled, (state, action) => {
            state.role = action.payload.data?.role as string;
            state.isGetLoading = false;
        });
        builder.addCase(getRightOfCourse.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getTop10Rate.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getTop10Rate.fulfilled, (state, action) => {
            state.top10Rate = action.payload.data as Course[];
            state.isGetLoading = false;
        });
        builder.addCase(getTop10Rate.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getTop10Enrolled.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getTop10Enrolled.fulfilled, (state, action) => {
            state.top10Enrolled = action.payload.data as Course[];
            state.isGetLoading = false;
        });
        builder.addCase(getTop10Enrolled.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getTop10Sale.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getTop10Sale.fulfilled, (state, action) => {
            state.top10Sale = action.payload.data as Course[];
            state.isGetLoading = false;
        });
        builder.addCase(getTop10Sale.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(addPromotion.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(addPromotion.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(addPromotion.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(stopPromotion.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(stopPromotion.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(stopPromotion.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(getAllCourses.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getAllCourses.fulfilled, (state, action) => {
            state.courses = action.payload.data?.data as Course[];
            state.totalPage = action.payload.data?.total_page || 0;
            state.totalRecord = action.payload.data?.total_record || 0;
            state.isGetLoading = false;
        });
        builder.addCase(getAllCourses.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(editCourse.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(editCourse.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(editCourse.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(createCourses.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(createCourses.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(createCourses.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(approveCourse.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(approveCourse.fulfilled, (state) => {
            state.isLoading = false;
            state.courseDetail.status = true;
        });
        builder.addCase(approveCourse.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(restrictCourse.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(restrictCourse.fulfilled, (state) => {
            state.isLoading = false;
            state.courseDetail.status = false;
        });
        builder.addCase(restrictCourse.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(getCertificate.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getCertificate.fulfilled, (state, action) => {
            state.isLoading = false;
            state.currentCertificate = action.payload.data.public_id;
        });
        builder.addCase(getCertificate.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(createFinalTest.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(createFinalTest.fulfilled, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(createFinalTest.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(updateFinalTest.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(updateFinalTest.fulfilled, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(updateFinalTest.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(deleteFinalTest.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(deleteFinalTest.fulfilled, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(deleteFinalTest.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(setDoneCourse.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(setDoneCourse.fulfilled, (state, action) => {
            state.isLoading = false;
        });
        builder.addCase(setDoneCourse.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(getFinalTestByCourseId.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getFinalTestByCourseId.fulfilled, (state, action) => {
            state.isLoading = false;
            state.courseDetail.test = action.payload.data;
        });
        builder.addCase(getFinalTestByCourseId.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(getCourseByAuthorId.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getCourseByAuthorId.fulfilled, (state, action) => {
            state.isGetLoading = false;
            state.totalPage = action.payload.data.total_page;
            state.totalRecord = action.payload.data.total_record;
            state.courses = action.payload.data.courses;
        });
        builder.addCase(getCourseByAuthorId.rejected, (state) => {
            state.isGetLoading = false;
        });
    },
});

export const {
    setStudyAndRequirement,
    setSalePriceAndDate,
    setApprovalCourseDetail,
    setCurrentCertificate,
    setIsFirstPass,
    setClearFinalTest,
    setPassCourse,
} = courseSlice.actions;

export default courseSlice.reducer;

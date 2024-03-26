import { Response } from "../../types/response";
import apis from "../../api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    GetAllQuizInGroup,
    QuizGroupType,
    QuizType,
    QuizCreateType,
    QuizGroupCreateType,
    GetAllQuizInGroupResponse,
} from "../../types/quiz";

export const createQuizGroup = createAsyncThunk<Response<null>, QuizGroupCreateType, { rejectValue: Response<null> }>(
    "quiz/group/create",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.quizApis.createQuizGroup(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const updateQuizGroup = createAsyncThunk<Response<null>, QuizGroupType, { rejectValue: Response<null> }>(
    "quiz/group/edit",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.quizApis.updateQuizGroup(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const deleteQuizGroup = createAsyncThunk<Response<null>, number, { rejectValue: Response<null> }>(
    "quiz/group/delete",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.quizApis.deleteQuizGroup(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const createQuiz = createAsyncThunk<Response<null>, QuizCreateType, { rejectValue: Response<null> }>(
    "quiz/create",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.quizApis.createQuiz(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const updateQuiz = createAsyncThunk<Response<null>, QuizType, { rejectValue: Response<null> }>(
    "quiz/edit",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.quizApis.updateQuiz(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const deleteQuiz = createAsyncThunk<Response<null>, number, { rejectValue: Response<null> }>(
    "quiz/delete",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.quizApis.deleteQuiz(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getAllQuizGroup = createAsyncThunk<Response<QuizGroupType[]>, void, { rejectValue: Response<null> }>(
    "quiz/group/get",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.quizApis.getAllQuizGroup();
            return response.data as Response<QuizGroupType[]>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const getAllQuizGroupHasQuiz = createAsyncThunk<
    Response<QuizGroupType[]>,
    void,
    { rejectValue: Response<null> }
>("quiz/group-test/get", async (body, ThunkAPI) => {
    try {
        const response = await apis.quizApis.getAllQuizGroupHasQuiz();
        return response.data as Response<QuizGroupType[]>;
    } catch (error: any) {
        return ThunkAPI.rejectWithValue(error.data as Response<null>);
    }
});
export const getAllQuizByGroupId = createAsyncThunk<
    Response<GetAllQuizInGroupResponse>,
    GetAllQuizInGroup,
    { rejectValue: Response<null> }
>("quiz/getall", async (body, ThunkAPI) => {
    try {
        const response = await apis.quizApis.getAllQuizByGroupId(body);
        return response.data as Response<GetAllQuizInGroupResponse>;
    } catch (error: any) {
        return ThunkAPI.rejectWithValue(error.data as Response<null>);
    }
});
type QuizSliceType = {
    quizGroupList: QuizGroupType[];
    quizList: QuizType[];
    // quizShow: QuizType;
    isLoading: boolean;
    isGetLoading: boolean;
};

const initialState: QuizSliceType = {
    quizGroupList: [],
    quizList: [],
    // quizShow: {
    //     quiz_id: 0,
    //     question: "",
    //     type: 0,
    //     quiz_answer: [],
    // },
    isLoading: false,
    isGetLoading: false,
};

export const quizSlice = createSlice({
    name: "quiz",
    initialState,
    reducers: {
        // setIsCourseInCart: (state, action) => {
        //     for (const cart_item of state.userCart.cart_items) {
        //         if (cart_item.course.course_id === Number(action.payload)) {
        //             state.isCourseInCart = true;
        //             break;
        //         } else state.isCourseInCart = false;
        //     }
        // }
    },
    extraReducers: (builder) => {
        builder.addCase(getAllQuizGroup.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getAllQuizGroup.fulfilled, (state, action) => {
            state.quizGroupList = action.payload?.data as QuizGroupType[];
            state.isGetLoading = false;
        });
        builder.addCase(getAllQuizGroup.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getAllQuizGroupHasQuiz.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getAllQuizGroupHasQuiz.fulfilled, (state, action) => {
            state.quizGroupList = action.payload?.data as QuizGroupType[];
            state.isGetLoading = false;
        });
        builder.addCase(getAllQuizGroupHasQuiz.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(getAllQuizByGroupId.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getAllQuizByGroupId.fulfilled, (state, action) => {
            state.quizList = action.payload.data?.quiz as QuizType[];
            state.isGetLoading = false;
        });
        builder.addCase(getAllQuizByGroupId.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(createQuizGroup.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(createQuizGroup.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(createQuizGroup.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(updateQuizGroup.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(updateQuizGroup.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(updateQuizGroup.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(deleteQuizGroup.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(deleteQuizGroup.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(deleteQuizGroup.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(createQuiz.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(createQuiz.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(createQuiz.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(updateQuiz.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(updateQuiz.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(updateQuiz.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(deleteQuiz.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(deleteQuiz.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(deleteQuiz.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

export const {} = quizSlice.actions;

export default quizSlice.reducer;

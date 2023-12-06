import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Lesson } from "../../types/lesson";
import { Response } from "../../types/response";
import apis from "../../api";
type LessonSliceType = {
    isLoading: boolean;
    lesson: Lesson;
};

export const getLessonById = createAsyncThunk<Response<Lesson>, number, { rejectValue: Response<null> }>(
    "lesson/1",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.lessonApis.getLessonById(body);
            return response.data as Response<Lesson>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const updateLesson = createAsyncThunk<Response<null>, FormData, { rejectValue: Response<null> }>(
    "lesson/update",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.lessonApis.updateLesson(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const createLesson = createAsyncThunk<Response<null>, FormData, { rejectValue: Response<null> }>(
    "lesson/create",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.lessonApis.createLesson(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const deleteLesson = createAsyncThunk<Response<null>, number, { rejectValue: Response<null> }>(
    "lesson/delete",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.lessonApis.deleteLesson(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
const initialState: LessonSliceType = {
    // nowUrlVideo: "",
    isLoading: false,
    lesson: {
        id: 0,
        title: "",
        url_video: "",
        duration: "",
        description: "",
    },
};

export const lessonSlice = createSlice({
    name: "lesson",
    initialState,
    reducers: {
        setLesson: (state, action) => {
            state.lesson = action.payload as Lesson;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getLessonById.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getLessonById.fulfilled, (state, action) => {
            state.lesson = action.payload.data as Lesson;
            state.isLoading = false;
        });
        builder.addCase(getLessonById.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

export const { setLesson } = lessonSlice.actions;

export default lessonSlice.reducer;

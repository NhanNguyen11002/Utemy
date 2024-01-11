import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Response } from "../../types/response";
import apis from "../../api";
import { Lecture } from "../../types/lecture";
type LectureSliceType = {
    isLoading: boolean;
    isGetLoading: boolean;
    lecture: Lecture;
};

export const getLectureById = createAsyncThunk<Response<Lecture>, number, { rejectValue: Response<null> }>(
    "lecture/1",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.lectureApis.getLectureById(body);
            return response.data as Response<Lecture>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const updateLecture = createAsyncThunk<Response<null>, FormData, { rejectValue: Response<null> }>(
    "lecture/update",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.lectureApis.updateLecture(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const createLecture = createAsyncThunk<Response<null>, FormData, { rejectValue: Response<null> }>(
    "lecture/create",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.lectureApis.createLecture(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const deleteLecture = createAsyncThunk<Response<null>, number, { rejectValue: Response<null> }>(
    "lecture/delete",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.lectureApis.deleteLecture(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
const initialState: LectureSliceType = {
    // nowUrlVideo: "",
    isLoading: false,
    isGetLoading: false,
    lecture: {
        type: "",
        lecture_id: 0,
        content: {},
    },
};

export const lectureSlice = createSlice({
    name: "lecture",
    initialState,
    reducers: {
        setLecture: (state, action) => {
            state.lecture = action.payload as Lecture;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getLectureById.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getLectureById.fulfilled, (state, action) => {
            state.lecture = action.payload.data as Lecture;
            state.isGetLoading = false;
        });
        builder.addCase(getLectureById.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(createLecture.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(createLecture.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(createLecture.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(deleteLecture.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(deleteLecture.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(deleteLecture.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(updateLecture.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(updateLecture.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(updateLecture.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

export const { setLecture } = lectureSlice.actions;

export default lectureSlice.reducer;

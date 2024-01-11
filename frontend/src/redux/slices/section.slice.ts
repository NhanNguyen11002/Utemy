import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Section, AddSection, EditSection } from "../../types/section";
import { Response } from "../../types/response";
import apis from "../../api";

type SectionSliceType = {
    sections: Section[];
    isGetLoading: boolean;
    isLoading: boolean;
};
export const getAllSectionByCourseId = createAsyncThunk<Response<Section[]>, string, { rejectValue: Response<null> }>(
    "section/get",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.sectionApis.getAllSectionByCourseId(body);
            return response.data as Response<Section[]>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const addSection = createAsyncThunk<Response<null>, AddSection, { rejectValue: Response<null> }>(
    "section/add",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.sectionApis.addSection(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const deleteSection = createAsyncThunk<Response<null>, number, { rejectValue: Response<null> }>(
    "section/delete",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.sectionApis.deleteSection(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);
export const editSection = createAsyncThunk<Response<null>, EditSection, { rejectValue: Response<null> }>(
    "section/edit",
    async (body, ThunkAPI) => {
        try {
            const response = await apis.sectionApis.editSection(body);
            return response.data as Response<null>;
        } catch (error: any) {
            return ThunkAPI.rejectWithValue(error.data as Response<null>);
        }
    },
);

const initialState: SectionSliceType = {
    sections: [],
    isGetLoading: false,
    isLoading: false,
};

export const sectionSlice = createSlice({
    name: "section",
    initialState,
    reducers: {
        setDeleteSection: (state, action: PayloadAction<number>) => {
            state.sections = state.sections.filter((section: Section) => section.id !== action.payload);
        },
        setEditSection: (state, action: PayloadAction<EditSection>) => {
            state.sections = state.sections.map((section: Section) => {
                if (section.id === action.payload.section_id) {
                    section.title = action.payload.title;
                }
                return section;
            });
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getAllSectionByCourseId.pending, (state) => {
            state.isGetLoading = true;
        });
        builder.addCase(getAllSectionByCourseId.fulfilled, (state, action) => {
            state.sections = action.payload.data as Section[];
            state.isGetLoading = false;
        });
        builder.addCase(getAllSectionByCourseId.rejected, (state) => {
            state.isGetLoading = false;
        });
        builder.addCase(addSection.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(addSection.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(addSection.rejected, (state) => {
            state.isLoading = false;
        });
        builder.addCase(editSection.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(editSection.fulfilled, (state) => {
            state.isLoading = false;
        });
        builder.addCase(editSection.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

export const { setDeleteSection, setEditSection } = sectionSlice.actions;

export default sectionSlice.reducer;

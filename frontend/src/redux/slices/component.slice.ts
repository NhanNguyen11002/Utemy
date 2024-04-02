import { createSlice } from "@reduxjs/toolkit";

type ComponentSliceType = {
    adminNavPlace: string;
    lecturerNavPlace: string;
};

const initialState: ComponentSliceType = {
    adminNavPlace: "",
    lecturerNavPlace: "",
};
export const componentSlice = createSlice({
    name: "component",
    initialState,
    reducers: {
        setAdminNavPlace: (state, action) => {
            state.adminNavPlace = action.payload;
        },
        setLecturerNavPlace: (state, action) => {
            state.lecturerNavPlace = action.payload;
        },
    },
});

export const { setAdminNavPlace, setLecturerNavPlace } = componentSlice.actions;

export default componentSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

type ComponentSliceType = {
    adminNavPlace: string;
};

const initialState: ComponentSliceType = {
    adminNavPlace: "",
};
export const componentSlice = createSlice({
    name: "component",
    initialState,
    reducers: {
        setAdminNavPlace: (state, action) => {
            state.adminNavPlace = action.payload;
        },
    },
});

export const { setAdminNavPlace } = componentSlice.actions;

export default componentSlice.reducer;

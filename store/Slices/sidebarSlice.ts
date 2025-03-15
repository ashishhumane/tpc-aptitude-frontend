import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isSidebarVisible: true,
}

const sidebarSlice = createSlice({
    name : "sidebar",
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.isSidebarVisible = !state.isSidebarVisible;
        },
        hideSidebar: (state) => {
            state.isSidebarVisible = false;
        },
        showSidebar: (state) => {
            state.isSidebarVisible = true;
        },
    }
});

export const { toggleSidebar, hideSidebar, showSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;
import { createSlice } from "@reduxjs/toolkit"; 

export const groupIdSlice = createSlice({
    name: 'groupId',
    initialState: {
        groupId: {groupId: 'feewfefw'}
    },
    reducers: {
        setGroupId: (state, action) => {
            state.groupId = action.payload;
        },
    },
})

export const { setGroupId } = groupIdSlice.actions;

export default groupIdSlice.reducer;
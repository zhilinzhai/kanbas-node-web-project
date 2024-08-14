import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  currentUser: localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser') || '{}') : null,
};
const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      localStorage.setItem('currentUser', JSON.stringify(action.payload));
    },
  },
});
export const { setCurrentUser } = accountSlice.actions;
export default accountSlice.reducer;

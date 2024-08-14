import { configureStore } from "@reduxjs/toolkit";
import modulesReducer from "./Courses/Modules/reducer";
import assignmentreducer from "./Courses/Assignments/reducer";
import accountReducer from "./Account/reducer";
const store = configureStore({
  reducer: {
    modulesReducer,
    assignmentreducer,
    accountReducer,
  },
});
export default store;


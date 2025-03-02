import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage
import { combineReducers } from "redux";
import authReducer from "./authSlice";
import adminReducer from "./Slices/adminSlices"; // Import admin reducer
import testReducer from "./Slices/testSlices"; // Import test reducer
import resultReducer from "./Slices/resultSlice"; // Import result reducer

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "test"], // Persist only auth state
};

const rootReducer = combineReducers({
  auth: authReducer,
  admin: adminReducer,
  test: testReducer,
  result: resultReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "test/setTimerId", // If you have timer ID in state
          "test/setInitialTime",
        ],
      },
    }),
});

const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store, persistor };

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import restaurantReducer from './slices/restaurantSlice';

// Persist configuration
const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['restaurants'], // Only persist restaurants slice
};

// Combine reducers
const rootReducer = combineReducers({
    restaurants: restaurantReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types from redux-persist
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'restaurants/fetchRestaurants/fulfilled'],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

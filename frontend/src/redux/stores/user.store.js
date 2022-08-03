import { configureStore } from '@reduxjs/toolkit'
import { userSlice } from '../slices/user.slice'

export const userStore = configureStore({
    reducer: {
        user: userSlice.reducer,
    },
})

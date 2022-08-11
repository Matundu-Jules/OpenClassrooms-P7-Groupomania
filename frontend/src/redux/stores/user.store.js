import { configureStore } from '@reduxjs/toolkit'
import { postsSlice } from '../slices/posts.slice'
import { userSlice } from '../slices/user.slice'

// Création du store Redux :
export const userStore = configureStore({
    reducer: {
        user: userSlice.reducer,
        posts: postsSlice.reducer,
    },
})

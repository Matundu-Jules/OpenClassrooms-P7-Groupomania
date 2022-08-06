import { createSlice } from '@reduxjs/toolkit'

export const postsSlice = createSlice({
    name: 'posts',
    initialState: null,
    reducers: {
        getAllPosts: (state, action) => {
            function sortArrayByDate(x, y) {
                if (x.createdAt > y.createdAt) {
                    return -1
                }
                if (x.createdAt < y.createdAt) {
                    return 1
                }
                return 0
            }

            action.payload.sort(sortArrayByDate)
            state = action.payload
            return state
        },
    },
})

export const { getAllPosts } = postsSlice.actions

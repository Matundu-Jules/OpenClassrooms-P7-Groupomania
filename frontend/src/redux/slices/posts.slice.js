import { createSlice } from '@reduxjs/toolkit'

export const postsSlice = createSlice({
    name: 'posts',
    initialState: {
        allPosts: null,
        myPosts: null,
    },
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
            state.allPosts = action.payload
            return state
        },
        getUserPosts: (state, action) => {
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
            state.myPosts = action.payload
            return state
        },
        deletePost: (state, action) => {
            state.allPosts = state.allPosts.filter(
                (post) => post._id !== action.payload
            )
            state.myPosts = state.myPosts.filter(
                (post) => post._id !== action.payload
            )
            return state
        },
    },
})

export const { getAllPosts, deletePost, getUserPosts } = postsSlice.actions

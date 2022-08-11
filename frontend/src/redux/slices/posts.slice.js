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

            if (action.payload.length === 0) {
                state.myPosts = null
                return state
            } else {
                action.payload.sort(sortArrayByDate)
                state.myPosts = action.payload
                return state
            }
        },
        deletePost: (state, action) => {
            if (state.allPosts) {
                state.allPosts = state.allPosts.filter(
                    (post) => post._id !== action.payload
                )
            } else if (state.myPosts) {
                state.myPosts = state.myPosts.filter(
                    (post) => post._id !== action.payload
                )
            }

            return state
        },
    },
})

export const { getAllPosts, deletePost, getUserPosts } = postsSlice.actions

import { createSlice } from '@reduxjs/toolkit'
import { useState } from 'react'

export const postsSlice = createSlice({
    name: 'posts',
    initialState: null,
    reducers: {
        getAllPosts: (state, action) => {
            state = action.payload
            return state
        },
    },
})

export const { getAllPosts } = postsSlice.actions

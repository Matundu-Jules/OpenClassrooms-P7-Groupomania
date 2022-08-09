import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        id: null,
        token: null,
        pseudo: null,
        createdAt: null,
        isConnected: false,
        tokenExpired: null,
        errorToken: null,
    },
    reducers: {
        login: (state, action) => {
            const { id, token, pseudo, isConnected, createdAt, role } =
                action.payload

            state.id = id
            state.token = token
            state.pseudo = pseudo
            state.createdAt = createdAt
            state.isConnected = isConnected
            state.role = role
            localStorage.setItem('user', JSON.stringify(action.payload))
        },
        logout: (state) => {
            state.id = null
            state.token = null
            state.pseudo = null
            state.createdAt = null
            state.isConnected = false
            state.errorToken = null
            state.role = null
            localStorage.clear()
        },
        checkIfAlreadyConnect: (state) => {
            if (localStorage.getItem('user')) {
                const user = JSON.parse(localStorage.getItem('user'))
                state.id = user.id
                state.token = user.token
                state.pseudo = user.pseudo
                state.createdAt = user.createdAt
                state.isConnected = user.isConnected
                state.role = user.role
            } else {
                state.id = null
                state.token = null
                state.pseudo = null
                state.createdAt = null
                state.isConnected = false
                state.role = null
            }
        },
        sessionExpired: (state, action) => {
            state.id = null
            state.token = null
            state.pseudo = null
            state.createdAt = null
            state.isConnected = false
            state.role = null
            state.errorToken = action.payload.errorToken
            localStorage.clear()
        },
    },
})

export const { login, logout, checkIfAlreadyConnect, sessionExpired } =
    userSlice.actions

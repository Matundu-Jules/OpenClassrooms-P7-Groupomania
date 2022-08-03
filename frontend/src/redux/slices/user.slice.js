import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        id: null,
        token: null,
        pseudo: null,
        isConnected: false,
    },
    reducers: {
        login: (state, action) => {
            // action {type:'user/login' payload:{id, token, pseudo, isConnected}
            // isConnected : function qui verify si un token est dans le localstorage} et qui retourne true ou false.

            const { id, token, pseudo, isConnected } = action.payload
            console.log(id, token, pseudo, isConnected)

            state.id = id
            state.token = token
            state.pseudo = pseudo
            state.isConnected = isConnected
            //   console.log(action.payload)
            localStorage.setItem('user', JSON.stringify(action.payload))
        },
        logout: (state) => {
            state.id = null
            state.token = null
            state.pseudo = null
            state.isConnected = false
            localStorage.clear()
        },
        checkIfAlreadyConnect: (state) => {
            if (localStorage.getItem('user')) {
                const user = JSON.parse(localStorage.getItem('user'))
                console.log(user)
                state.id = user.id
                state.token = user.token
                state.pseudo = user.pseudo
                state.isConnected = user.isConnected
                console.log()
            } else {
                state.id = null
                state.token = null
                state.pseudo = null
                state.isConnected = false
            }
        },
    },
})

export const { login, logout, checkIfAlreadyConnect } = userSlice.actions

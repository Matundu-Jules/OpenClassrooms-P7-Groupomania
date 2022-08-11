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
        // Connexion :
        login: (state, action) => {
            // Récupération des valeurs dans le payload :
            const { id, token, pseudo, isConnected, createdAt, role } =
                action.payload

            // Définition des valeurs du state user :
            state.id = id
            state.token = token
            state.pseudo = pseudo
            state.createdAt = createdAt
            state.isConnected = isConnected
            state.role = role

            // Stocker les valeur dans le localStorage pour persister la connexion :
            localStorage.setItem('user', JSON.stringify(action.payload))
        },
        // Deconnexion :
        logout: (state) => {
            // Suppression des valeurs dans le state et dans le localStorage :
            state.id = null
            state.token = null
            state.pseudo = null
            state.createdAt = null
            state.isConnected = false
            state.errorToken = null
            state.role = null
            localStorage.clear()
        },
        // Vérifier si l'user est déja connecter :
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
        // Supprssion des valeurs su state et localStorage si la session est expirer (Token expirer)
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

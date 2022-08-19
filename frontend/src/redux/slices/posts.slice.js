import { createSlice } from '@reduxjs/toolkit'

// Création de la slice post pour le store Redux :
export const postsSlice = createSlice({
    name: 'posts',
    initialState: {
        allPosts: null,
        myPosts: null,
    },
    reducers: {
        getAllPosts: (state, action) => {
            // Trie des posts du plus récent au plus ancien :
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
            // Trie des posts du plus récent au plus ancien :
            function sortArrayByDate(x, y) {
                if (x.createdAt > y.createdAt) {
                    return -1
                }
                if (x.createdAt < y.createdAt) {
                    return 1
                }
                return 0
            }

            // Si l'user n'a pas créer de post => return null dans le state myPosts
            if (action.payload.length === 0) {
                state.myPosts = null
                return state
            } else {
                // Sinon trier les posts et les stocker dans le state myPosts
                action.payload.sort(sortArrayByDate)
                state.myPosts = action.payload
                return state
            }
        },
        // Suppression de posts dans les states :
        deletePost: (state, action) => {
            if (state.allPosts) {
                state.allPosts = state.allPosts.filter(
                    (post) => post._id !== action.payload
                )
            }
            if (state.myPosts) {
                state.myPosts = state.myPosts.filter(
                    (post) => post._id !== action.payload
                )
            }

            return state
        },
    },
})

export const { getAllPosts, deletePost, getUserPosts } = postsSlice.actions

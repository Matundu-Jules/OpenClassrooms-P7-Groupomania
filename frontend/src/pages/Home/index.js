import { useContext, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ApiContext } from '../../context/ApiContext'
import { getAllPosts } from '../../redux/slices/posts.slice'
import { sessionExpired } from '../../redux/slices/user.slice'
import Login from '../Login'
import Post from './components/Post'
import styles from './Home.module.scss'

function Home() {
    const user = useSelector((state) => state.user)
    let posts = useSelector((state) => state.posts)

    const BASE_URL = useContext(ApiContext)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!user.token) {
            return
        } else {
            async function getAllPost() {
                try {
                    const response = await fetch(`${BASE_URL}/posts`, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    })
                    const data = await response.json()

                    if (!response.ok) {
                        if (data.tokenExpired) {
                            dispatch(
                                sessionExpired({ errorToken: data.message })
                            )
                        } else {
                            throw new Error('Une erreur est survenue.')
                        }
                    } else {
                        dispatch(getAllPosts(data))
                    }
                } catch (e) {
                    console.error(e)
                } finally {
                }
            }
            getAllPost()
        }
    }, [BASE_URL, user, dispatch])

    return (
        <>
            {user.isConnected ? (
                <div className={styles.homepage}>
                    <h1>{`Bienvenue ${user.pseudo}`}</h1>
                    <p>Vous etes connecter.</p>
                    {posts && posts.map((p) => <Post post={p} key={p._id} />)}
                </div>
            ) : (
                <div className={styles.homepage}>
                    <h1>Bienvenue sur Groupomania</h1>
                    <p>
                        Vous ne pouvez pas accéder à cette page, merci de vous
                        connecter.
                    </p>
                    {/* <Link to="/login">Connexion</Link>
                    <Link to="/singup">Connexion</Link> */}

                    <Login />
                </div>
            )}
        </>
    )
}

export default Home

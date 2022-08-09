import { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ApiContext } from '../../context/ApiContext'
import { sessionExpired } from '../../redux/slices/user.slice'
import { getUserPosts } from '../../redux/slices/posts.slice'
import Post from '../Home/components/Post'
import styles from './MyPosts.module.scss'
import Login from '../Login'
import Loader from '../../components/Loader'

function MyPosts() {
    const [isLoading, setIsLoading] = useState(false)
    // Récupérer l'id de l'user depuis l'url :
    const user = useSelector((state) => state.user)
    const myPosts = useSelector((state) => state.posts.myPosts)

    const BASE_URL = useContext(ApiContext)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!user.token) {
            return
        } else {
            async function getAllUserPost() {
                try {
                    setIsLoading(true)
                    const response = await fetch(
                        `${BASE_URL}/posts/myposts/${user.id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${user.token}`,
                            },
                        }
                    )
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
                        dispatch(getUserPosts(data))
                    }
                } catch (e) {
                    console.error(e)
                } finally {
                    setIsLoading(false)
                }
            }
            getAllUserPost()
        }
    }, [BASE_URL, user, dispatch])

    return (
        <>
            {user.isConnected ? (
                <div className={styles.homepage}>
                    <h1>Mes posts</h1>
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <>
                            {myPosts &&
                                myPosts.map((p) => (
                                    <Post post={p} key={p._id} />
                                ))}
                        </>
                    )}
                </div>
            ) : (
                <div className={styles.homepage}>
                    <h1>Bienvenue sur Groupomania</h1>
                    <p>
                        Vous ne pouvez pas accéder à cette page, merci de vous
                        connecter.
                    </p>
                    <Login />
                </div>
            )}
        </>
    )
}

export default MyPosts

import { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ApiContext } from '../../context/ApiContext'
import { sessionExpired } from '../../redux/slices/user.slice'
import { getUserPosts } from '../../redux/slices/posts.slice'
import Post from '../Home/components/Post'
import styles from './MyPosts.module.scss'
import Loader from '../../components/Loader'
import { Navigate } from 'react-router-dom'

function MyPosts() {
    // State :
    const [isLoading, setIsLoading] = useState(false)

    // Redux :
    const user = useSelector((state) => state.user)
    const myPosts = useSelector((state) => state.posts.myPosts)
    const dispatch = useDispatch()

    // Context :
    const BASE_URL = useContext(ApiContext)

    useEffect(() => {
        if (!user.token) {
            return
        } else {
            async function getAllUserPost() {
                try {
                    setIsLoading(true)

                    // Requête GET - Récupération de tout les posts créer par l'user :
                    const response = await fetch(
                        `${BASE_URL}/posts/myposts/${user.id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${user.token}`,
                            },
                        }
                    )

                    const data = await response.json()

                    // Gestion d'erreurs :
                    if (!response.ok) {
                        if (data.tokenExpired) {
                            dispatch(
                                sessionExpired({ errorToken: data.message })
                            )
                        } else {
                            throw new Error('Une erreur est survenue.')
                        }
                    } else {
                        // Ajouter tout les posts dans le state "myPosts" gérer par Redux :
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
                            {!myPosts && (
                                <p>Vous n'avez pas encore créer de post.</p>
                            )}

                            <div className={styles.dashboardMyPosts}>
                                {myPosts &&
                                    myPosts.map((p) => (
                                        <Post post={p} key={p._id} />
                                    ))}
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <Navigate to="/" replace={true} />
            )}
        </>
    )
}

export default MyPosts

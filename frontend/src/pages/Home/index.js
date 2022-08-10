import { useContext, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Loader from '../../components/Loader'
import { ApiContext } from '../../context/ApiContext'
import { getAllPosts } from '../../redux/slices/posts.slice'
import { sessionExpired } from '../../redux/slices/user.slice'
import Login from '../Login'
import Post from './components/Post'
import styles from './Home.module.scss'

function Home() {
    const [isLoading, setIsLoading] = useState(false)
    const user = useSelector((state) => state.user)
    let posts = useSelector((state) => state.posts.allPosts)

    const BASE_URL = useContext(ApiContext)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!user.token) {
            return
        } else {
            async function getAllPost() {
                try {
                    setIsLoading(true)
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
                    setIsLoading(false)
                }
            }
            getAllPost()
        }
    }, [BASE_URL, user, dispatch])

    return (
        <>
            {user.isConnected ? (
                <div className={styles.homepage}>
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <>
                            <h1>{`Bienvenue ${user.pseudo}`}</h1>
                            <div
                                className={`${
                                    user.role === 'Admin'
                                        ? `${styles.dashboardAdmin}`
                                        : `${styles.postsContainer}`
                                } `}
                            >
                                {posts &&
                                    posts.map((p) => (
                                        <Post post={p} key={p._id} />
                                    ))}
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <div className={styles.homepage}>
                    <h1>Bienvenue sur Groupomania</h1>
                    <Login />
                </div>
            )}
        </>
    )
}

export default Home

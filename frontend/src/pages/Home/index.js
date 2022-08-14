import { useContext, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Loader from '../../components/Loader'
import { ApiContext } from '../../context/ApiContext'
import { getAllPosts } from '../../redux/slices/posts.slice'
import { sessionExpired } from '../../redux/slices/user.slice'
import Post from './components/Post'
import styles from './Home.module.scss'

function Home() {
    // State :
    const [isLoading, setIsLoading] = useState(false)

    // Redux :
    const user = useSelector((state) => state.user)
    let posts = useSelector((state) => state.posts.allPosts)
    const dispatch = useDispatch()

    // Context :
    const BASE_URL = useContext(ApiContext)

    useEffect(() => {
        // Si le user n'a plus de token, ne pas éxécuter le code du useEffect :
        if (!user.token) {
            return
        } else {
            async function getAllPost() {
                try {
                    setIsLoading(true)

                    // Requête GET : Récupérer tout les posts :
                    const response = await fetch(`${BASE_URL}/posts`, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    })
                    const data = await response.json()

                    // Vérification et renvoie des erreurs si la requête échoue :
                    if (!response.ok) {
                        if (data.tokenExpired) {
                            dispatch(
                                sessionExpired({ errorToken: data.message })
                            )
                        } else {
                            throw new Error('Une erreur est survenue.')
                        }
                    } else {
                        // Ajouter tout les posts dans le state "posts" gérer par Redux :
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
                <main className={styles.homepage}>
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <>
                            <h1
                                className={styles.titleIsLogin}
                            >{`Bienvenue ${user.pseudo}`}</h1>
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
                </main>
            ) : (
                <div className={styles.homepage}>
                    <h1 className={styles.firstTitleHomepage}>
                        Bienvenue sur Groupomania
                    </h1>
                    <h2 className={styles.secondTitleHomepage}>
                        Notre réseau qui renforcera nos liens
                    </h2>
                    {user.errorToken ? (
                        <p className="form-error">{user.errorToken}</p>
                    ) : (
                        <p className={styles.pHomepage}>
                            Pour accéder au site, veuillez vous inscrire ou vous
                            connecter.
                        </p>
                    )}
                </div>
            )}
        </>
    )
}

export default Home

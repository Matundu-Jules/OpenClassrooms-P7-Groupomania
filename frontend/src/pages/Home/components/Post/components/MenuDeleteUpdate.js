import { useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import Loader from '../../../../../components/Loader'
import { ApiContext } from '../../../../../context/ApiContext'
import { deletePost } from '../../../../../redux/slices/posts.slice'
import { sessionExpired } from '../../../../../redux/slices/user.slice'
import styles from './MenuDeleteUpdate.module.scss'

function MenuDeleteUpdate({ post }) {
    // State :
    const [isLoading, setIsLoading] = useState(false)

    // Redux :
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()

    // Context :
    const BASE_URL = useContext(ApiContext)

    // Récupération de l'id du post :
    const postId = post._id

    // Récupération de l'url actuel :
    const currentUrl = useLocation().pathname

    // Suppression d'un post //
    async function handleClickDelete() {
        try {
            setIsLoading(true)
            const response = await fetch(`${BASE_URL}/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
                body: { userId: user.id },
            })
            const data = await response.json()
            if (!response.ok) {
                if (data.tokenExpired) {
                    dispatch(sessionExpired({ errorToken: data.message }))
                } else {
                    throw new Error('Une erreur est survenue.')
                }
            } else {
                dispatch(deletePost(postId))
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <nav className={styles.modifyDeleteLinkContainer}>
            <Link
                to={`/modifypost/${postId}`}
                className={styles.modifyLink}
                state={{ post, previousUrl: currentUrl }}
            >
                Modifier le post
            </Link>
            {isLoading ? (
                <Loader />
            ) : (
                <Link
                    to={currentUrl}
                    className={styles.deleteLink}
                    onClick={handleClickDelete}
                >
                    Supprimer le post
                </Link>
            )}
        </nav>
    )
}

export default MenuDeleteUpdate

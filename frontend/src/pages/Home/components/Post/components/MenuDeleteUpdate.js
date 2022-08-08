import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { ApiContext } from '../../../../../context/ApiContext'
import { deletePost } from '../../../../../redux/slices/posts.slice'
import { sessionExpired } from '../../../../../redux/slices/user.slice'
import styles from './MenuDeleteUpdate.module.scss'

function MenuDeleteUpdate({ post }) {
    const BASE_URL = useContext(ApiContext)
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const postId = post._id

    const currentUrl = useLocation().pathname

    // Suppression d'un post :
    async function handleClickDelete() {
        try {
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
        }
    }

    return (
        <nav className={styles.modifyDeleteLinkContainer}>
            <Link
                to={`/post/modify/${postId}`}
                className={styles.modifyLink}
                state={{ post, previousUrl: currentUrl }}
            >
                Modifier
            </Link>
            <Link
                to={currentUrl}
                className={styles.deleteLink}
                onClick={handleClickDelete}
            >
                Supprimer
            </Link>
        </nav>
    )
}

export default MenuDeleteUpdate

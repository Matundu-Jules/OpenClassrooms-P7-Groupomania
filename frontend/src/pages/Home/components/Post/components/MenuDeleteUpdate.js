import { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ApiContext } from '../../../../../context/ApiContext'
import { deletePost } from '../../../../../redux/slices/posts.slice'
import { sessionExpired } from '../../../../../redux/slices/user.slice'
import styles from './MenuDeleteUpdate.module.scss'

function MenuDeleteUpdate({ postId }) {
    const BASE_URL = useContext(ApiContext)
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()

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
            <Link to={`/post/${postId}`} className={styles.modifyLink}>
                Modifier
            </Link>
            <Link
                to="/"
                className={styles.deleteLink}
                onClick={handleClickDelete}
            >
                Supprimer
            </Link>
        </nav>
    )
}

export default MenuDeleteUpdate

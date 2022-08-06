import { Link } from 'react-router-dom'
import styles from './MenuDeleteUpdate.module.scss'

function MenuDeleteUpdate({ postId }) {
    return (
        <nav className={styles.modifyDeleteLinkContainer}>
            <Link to={`/post/${postId}`} className={styles.modifyLink}>
                Modifier
            </Link>
            <Link to="/" className={styles.deleteLink}>
                Supprimer
            </Link>
        </nav>
    )
}

export default MenuDeleteUpdate

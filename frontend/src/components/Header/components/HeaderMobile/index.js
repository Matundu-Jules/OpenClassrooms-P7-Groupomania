import { Link } from 'react-router-dom'
import styles from './HeaderMobile.module.scss'

function HeaderMobile({ user, handleClickLogout }) {
    let navigation

    if (!user.role) {
        navigation = (
            <nav className={styles.menuContainer}>
                <Link to="/">Accueil</Link>
                <Link to="/login">Connexion</Link>
                <Link to="/signup">S'inscrire</Link>
            </nav>
        )
    } else if (user.role === 'Basic') {
        navigation = (
            <nav className={styles.menuContainer}>
                <Link to="/">Accueil</Link>
                <Link to="/post">Créer un Post</Link>
                <Link to="/myposts">Mes Posts</Link>
                <Link to="/" onClick={handleClickLogout}>
                    Déconnexion
                </Link>
            </nav>
        )
    } else if (user.role === 'Admin') {
        navigation = (
            <nav className={styles.menuContainer}>
                <Link to="/">Gérer les posts</Link>
                <Link to="/post">Créer un Post</Link>
                <Link to="/" onClick={handleClickLogout}>
                    Déconnexion
                </Link>
            </nav>
        )
    }

    return <>{navigation}</>
}

export default HeaderMobile

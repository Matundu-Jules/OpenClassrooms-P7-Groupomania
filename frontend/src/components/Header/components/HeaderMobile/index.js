import { Link, NavLink } from 'react-router-dom'
import styles from './HeaderMobile.module.scss'

function HeaderMobile({ user, handleClickLogout }) {
    // Définition du style pour les users et pour l'admin //
    let navigation

    if (!user.role) {
        navigation = (
            <nav className={styles.menuContainer}>
                <NavLink to="/">Accueil</NavLink>
                <NavLink to="/login">Connexion</NavLink>
                <NavLink to="/signup">S'inscrire</NavLink>
            </nav>
        )
    } else if (user.role === 'Basic') {
        navigation = (
            <nav className={styles.menuContainer}>
                <NavLink to="/">Accueil</NavLink>
                <NavLink to="/post">Créer un Post</NavLink>
                <NavLink to="/myposts">Mes Posts</NavLink>
                <Link to="/" onClick={handleClickLogout}>
                    Déconnexion
                </Link>
            </nav>
        )
    } else if (user.role === 'Admin') {
        navigation = (
            <nav className={styles.menuContainer}>
                <NavLink to="/">Gérer les posts</NavLink>
                <NavLink to="/post">Créer un Post</NavLink>
                <NavLink to="/myposts">Mes Posts</NavLink>
                <Link to="/" onClick={handleClickLogout}>
                    Déconnexion
                </Link>
            </nav>
        )
    }

    return <>{navigation}</>
}

export default HeaderMobile

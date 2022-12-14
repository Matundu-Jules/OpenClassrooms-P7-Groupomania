import { Link, NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import groupomaniaLogo from '../../assets/images/logo-modified.png'
import styles from './Header.module.scss'
import { logout } from '../../redux/slices/user.slice'
import { useState } from 'react'
import HeaderMobile from './components/HeaderMobile'

function Header() {
    // State :
    const [showMenu, setShowMenu] = useState(false)

    // Redux :
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()

    // Définition du style pour les users et pour l'admin //
    let navigation
    if (user.role === 'Basic') {
        navigation = (
            <>
                <nav className={styles.navigation}>
                    <NavLink to="/">Accueil</NavLink>
                    <NavLink to="/post">Créer un Post</NavLink>
                    <NavLink to="/myposts">Mes Posts</NavLink>
                    <Link to="/" onClick={handleClickLogout}>
                        Déconnexion
                    </Link>
                </nav>
                <i
                    className={`fa-solid fa-bars ${styles.headerXs}`}
                    onClick={() => setShowMenu(!showMenu)}
                ></i>
                {showMenu && (
                    <>
                        <div
                            className="calc"
                            onClick={() => setShowMenu(false)}
                        ></div>
                        <HeaderMobile
                            user={user}
                            handleClickLogout={handleClickLogout}
                        />
                    </>
                )}
            </>
        )
    } else if (user.role === 'Admin') {
        navigation = (
            <>
                <nav className={styles.navigation}>
                    <NavLink to="/">Gérer les posts</NavLink>
                    <NavLink to="/post">Créer un Post</NavLink>
                    <NavLink to="/myposts">Mes Posts</NavLink>
                    <Link to="/" onClick={handleClickLogout}>
                        Déconnexion
                    </Link>
                </nav>
                <i
                    className={`fa-solid fa-bars ${styles.headerXs}`}
                    onClick={() => setShowMenu(!showMenu)}
                ></i>
                {showMenu && (
                    <>
                        <div
                            className="calc"
                            onClick={() => setShowMenu(false)}
                        ></div>
                        <HeaderMobile
                            user={user}
                            handleClickLogout={handleClickLogout}
                        />
                    </>
                )}
            </>
        )
    }

    // Gestion event pour la déconnexion //
    function handleClickLogout() {
        dispatch(logout())
    }

    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <Link to="/">
                    <img src={groupomaniaLogo} alt="Logo de Groupomania" />
                </Link>
            </div>
            {user.isConnected ? (
                <>{navigation}</>
            ) : (
                <>
                    <nav className={styles.navigation}>
                        <NavLink to="/">Accueil</NavLink>
                        <NavLink to="/login">Connexion</NavLink>
                        <NavLink to="/signup">S'inscrire</NavLink>
                    </nav>
                    <i
                        className={`fa-solid fa-bars ${styles.headerXs}`}
                        onClick={() => setShowMenu(!showMenu)}
                    ></i>
                    {showMenu && (
                        <>
                            <div
                                className="calc"
                                onClick={() => setShowMenu(false)}
                            ></div>
                            <HeaderMobile
                                user={user}
                                handleClickLogout={handleClickLogout}
                            />
                        </>
                    )}
                </>
            )}
        </header>
    )
}

export default Header

import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import groupomaniaLogo from '../../assets/images/logo-modified.png'
import styles from './Header.module.scss'
import { logout } from '../../redux/slices/user.slice'
import { useState } from 'react'
import HeaderMobile from './components/HeaderMobile'

function Header() {
    const [showMenu, setShowMenu] = useState(false)
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()

    let navigation
    if (user.role === 'Basic') {
        navigation = (
            <>
                <nav className={styles.navigation}>
                    <Link to="/">Accueil</Link>
                    <Link to="/post">Créer un Post</Link>
                    <Link to="/myposts">Mes Posts</Link>
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
                    <Link to="/">Gérer les posts</Link>
                    <Link to="/post">Créer un Post</Link>
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
                        <Link to="/">Accueil</Link>
                        <Link to="/login">Connexion</Link>
                        <Link to="/signup">S'inscrire</Link>
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

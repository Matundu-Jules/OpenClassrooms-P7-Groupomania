import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import groupomaniaLogo from '../../assets/images/logo-modified.png'
import styles from './Header.module.scss'
import { logout } from '../../redux/slices/user.slice'

function Header() {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()

    let navigation
    if (user.role === 'Basic') {
        navigation = (
            <nav>
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
            <nav>
                <Link to="/">Gérer les posts</Link>
                <Link to="/post">Créer un Post</Link>
                <Link to="/" onClick={handleClickLogout}>
                    Déconnexion
                </Link>
            </nav>
        )
    }

    function handleClickLogout() {
        dispatch(logout())
    }

    return (
        <header>
            <div>
                <img src={groupomaniaLogo} alt="Logo de Groupomania" />
            </div>
            {user.isConnected ? (
                <>{navigation}</>
            ) : (
                <nav>
                    <Link to="/">Accueil</Link>
                    <Link to="/login">Connexion</Link>
                    <Link to="/signup">S'inscrire</Link>
                </nav>
            )}
        </header>
    )
}

export default Header

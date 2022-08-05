import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import groupomaniaLogo from '../../assets/images/logo-modified.png'
import styles from './Header.module.scss'
import { logout } from '../../redux/slices/user.slice'

function Header() {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()

    function handleClickLogout() {
        dispatch(logout())
    }

    return (
        <header>
            <div>
                <img src={groupomaniaLogo} alt="Logo de Groupomania" />
            </div>
            {user.isConnected ? (
                <nav>
                    <Link to="/">Accueil</Link>
                    <Link to="/post">Créer un Post</Link>
                    <Link to={`/profile/${user.id}`}>Mon profil</Link>
                    <Link to="/" onClick={handleClickLogout}>
                        Déconnexion
                    </Link>
                </nav>
            ) : (
                <nav>
                    <Link to="/">Accueil</Link>
                    <Link to="/login">Connexion</Link>
                    <Link to="/signup">S'inscrire</Link>
                </nav>
            )}

            {/* Si isConnected=true alors afficher btn Deconnexion et Profil sinon Connexion et Inscription */}
            {/* <Link to={`/profile/${_id}`}>Mon profil</Link> */}
        </header>
    )
}

export default Header

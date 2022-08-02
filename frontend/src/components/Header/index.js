import { Link } from 'react-router-dom'
import styles from './Header.module.scss'
import groupomaniaLogo from '../../assets/images/logo-modified.png'

function Header() {
    return (
        <header>
            <div>
                <img src={groupomaniaLogo} alt="Logo de Groupomania" />
            </div>
            <nav>
                <Link to="/">Accueil</Link>
                {/* Si isConnected=true alors afficher btn Deconnexion et Profil sinon Connexion et Iscription */}
                <Link to="/login">Connexion</Link>
                <Link to="/signup">S'inscrire</Link>
                <Link to="/profile/:id">Mon profil</Link>
                {/* <Link to={`/profile/${_id}`}>Mon profil</Link> */}
            </nav>
        </header>
    )
}

export default Header

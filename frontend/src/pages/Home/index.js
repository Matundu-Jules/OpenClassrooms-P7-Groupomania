import { useSelector, useDispatch } from 'react-redux'
import Login from '../Login'
import styles from './Home.module.scss'

/* 
    Si l'utilisateur est connecter, afficher tout les posts. => state : isConnected(true)
    Si il n'est pas connecter, afficher le formulaire d'inscription ou de connexion. state => isConnected(false) 
*/

function Home() {
    const user = useSelector((state) => state.user)
    // const dispatch = useDispatch()
    // dispatch({ type: 'user/checkIfAlreadyConnect' })

    // console.log()
    return (
        <>
            {user.isConnected ? (
                <div>
                    <h1>{`Bienvenue ${user.pseudo}`}</h1>
                    <p>Vous etes connecter.</p>
                </div>
            ) : (
                <div>
                    <h1>Bienvenue sur Groupomania</h1>
                    <p>
                        Vous ne pouvez pas accéder à cette page, merci de vous
                        connecter.
                    </p>
                    <Login />
                </div>
            )}
        </>

        // <div>
        //     <h1>Groupomania</h1>
        // </div>
    )
}

export default Home

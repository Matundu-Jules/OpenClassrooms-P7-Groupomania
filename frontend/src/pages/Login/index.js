import { useState } from 'react'
import styles from './Login.module.scss'

function Login() {
    const [success, setSuccess] = useState(false)

    function handleClickLogin(e) {
        e.stopPropagation()
        setSuccess(true)
    }

    return (
        <section>
            {success ? (
                <h1>Success</h1>
            ) : (
                <form>
                    <h1>Connexion</h1>
                    <div className={`${styles.labelInputContainer}`}>
                        <label htmlFor="email">Email</label>
                        <input type="text" id="email" />
                    </div>
                    <div className={`${styles.labelInputContainer}`}>
                        <label htmlFor="password">Mot de passe</label>
                        <input type="password" id="password" />
                    </div>
                    <button onClick={handleClickLogin}>Valider</button>
                </form>
            )}
        </section>
    )
}

export default Login

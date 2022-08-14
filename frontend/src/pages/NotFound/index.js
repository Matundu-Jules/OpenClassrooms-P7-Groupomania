import styles from './NotFound.module.scss'

function NotFound() {
    return (
        <main className={styles.notfoundContainer}>
            <h1>404 : Cette page n'existe pas</h1>
            <p>Veuillez vous rediriger vers la page d'accueil.</p>
        </main>
    )
}

export default NotFound

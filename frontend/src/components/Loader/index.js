import styles from './Loader.module.scss'

function Loader() {
    return (
        <div className={styles.spinnerContainer}>
            <i className={`fa-solid fa-spinner ${styles.spinner}`}></i>
        </div>
    )
}

export default Loader

import styles from './CreatePost.module.scss'
import { useState } from 'react'

function CreatePost() {
    const [isLoading, setIsLoading] = useState(false)

    return (
        <section>
            <form className="card">
                <h1>Créer un post</h1>
                <div className={`${styles.labelInputContainer}`}>
                    <label htmlFor="title">Titre du post</label>
                    <input type="text" id="title" />
                </div>
                <div className={`${styles.labelInputContainer}`}>
                    <label htmlFor="img">Image</label>
                    <input type="file" id="img" />
                </div>
                <div className={`${styles.labelInputContainer}`}>
                    <label htmlFor="description">Description</label>
                    <textarea
                        name="description"
                        id="description"
                        cols="30"
                        rows="10"
                    ></textarea>
                </div>
                {isLoading ? (
                    <p>Chargement...</p>
                ) : (
                    <button className="btn btn-reverse-primary">Valider</button>
                )}
            </form>
        </section>
    )
}

export default CreatePost

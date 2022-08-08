import { useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import MenuDeleteUpdate from './components/MenuDeleteUpdate'
import styles from './Post.module.scss'

function Post({ post }) {
    const [showMenuDeleteUpdate, setShowMenuDeleteUpdate] = useState(false)
    const user = useSelector((state) => state.user)

    // Gestion de la date et de l'heure.
    const date = moment(post.createdAt).locale('fr')
    const dateString = date.format('DD/MM/YYYY')
    const hourString = date.format('HH')
    const minString = date.format('mm')
    const hourMinFormat = `${hourString}h${minString}`

    return (
        <div className={`card ${styles.post}`}>
            <div className={styles.infosCardContainer}>
                <div className={styles.titleContainer}>
                    {user.id === post.userId && (
                        <i
                            className={`fa-solid fa-bars ${styles.menu}`}
                            onClick={() =>
                                setShowMenuDeleteUpdate(!showMenuDeleteUpdate)
                            }
                        ></i>
                    )}
                    {showMenuDeleteUpdate && <MenuDeleteUpdate post={post} />}
                    <h2>{post.title}</h2>
                </div>
                <p
                    className={styles.date}
                >{`${dateString} à ${hourMinFormat}`}</p>
                <div className={styles.imageContainer}>
                    <img src={post.imageUrl} alt={post.title} />
                </div>
                <p className={styles.pseudo}>{`Par ${post.pseudo}.`}</p>
                <p className={styles.description}>{post.description}</p>
                <div className={styles.reactionContainer}>
                    <div className={styles.likeContainer}>
                        <i className="fa-solid fa-thumbs-up"></i>
                        <span>{post.likes}</span>
                    </div>
                    <div className={styles.dislikeContainer}>
                        <i className="fa-solid fa-thumbs-up"></i>
                        <span>{post.dislikes}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Post

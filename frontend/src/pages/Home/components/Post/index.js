import { useState } from 'react'
import { useSelector } from 'react-redux'
import MenuDeleteUpdate from '../MenuDeleteUpdate'
import styles from './Post.module.scss'

function Post({ post }) {
    const [showMenuDeleteUpdate, setShowMenuDeleteUpdate] = useState(false)
    const user = useSelector((state) => state.user)
    console.log(post)

    return (
        <div className={`card ${styles.post}`}>
            <div className={styles.titleContainer}>
                {user.id === post.userId && (
                    <i
                        className={`fa-solid fa-bars ${styles.menu}`}
                        onClick={() =>
                            setShowMenuDeleteUpdate(!showMenuDeleteUpdate)
                        }
                    ></i>
                )}
                {showMenuDeleteUpdate && <MenuDeleteUpdate />}
                <h2>{post.title}</h2>

                <p className={styles.pseudo}>By</p>
            </div>

            <div className={styles.imageContainer}>
                <img src={post.imageUrl} alt="" />
            </div>
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
    )
}

export default Post

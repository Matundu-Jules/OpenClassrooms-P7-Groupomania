import { useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import MenuDeleteUpdate from './components/MenuDeleteUpdate'
import styles from './Post.module.scss'
import { ApiContext } from '../../../../context/ApiContext'
import { sessionExpired } from '../../../../redux/slices/user.slice'
import { useLocation } from 'react-router-dom'

function Post({ post }) {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const BASE_URL = useContext(ApiContext)
    const [showMenuDeleteUpdate, setShowMenuDeleteUpdate] = useState(false)

    // Vérifier si l'user à déja liker et initialiser le state :
    const liked = !!post.usersLiked.find((id) => id === user.id)
    const [isLiked, setIsLiked] = useState(liked)

    // Vérifier si l'user à déja disliker et initialiser le state :
    const disliked = !!post.usersDisliked.find((id) => id === user.id)
    const [isDisliked, setIsDisliked] = useState(disliked)

    // Ajout d'un state pour mettre à jour les likes / dislikes :
    let [likes, setLikes] = useState(post.likes)
    let [dislikes, setDislikes] = useState(post.dislikes)

    // Gestion de la date et de l'heure.
    const date = moment(post.createdAt).locale('fr')
    const dateString = date.format('DD/MM/YYYY')
    const hourString = date.format('HH')
    const minString = date.format('mm')
    const hourMinFormat = `${hourString}h${minString}`

    // Ajout de Likes :
    async function handleClickLike() {
        try {
            // Si l'user n'a pas liker ou a déja disliker :
            if (!isLiked || isDisliked) {
                const response = await fetch(
                    `${BASE_URL}/posts/${post._id}/like`,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId: user.id,
                            like: 1,
                        }),
                    }
                )

                const data = await response.json()

                if (!response.ok) {
                    if (data.tokenExpired) {
                        dispatch(sessionExpired({ errorToken: data.message }))
                    } else {
                        throw new Error('Une erreur est survenue.')
                    }
                } else {
                    // Inversement des valeurs pour style et incrémentation :
                    setIsLiked(!isLiked)
                    setLikes(likes + 1)
                    if (isDisliked) {
                        setIsDisliked(false)
                        setDislikes(dislikes - 1)
                    }
                }
            } else {
                // Sinon si l'user a déja liker :
                const response = await fetch(
                    `${BASE_URL}/posts/${post._id}/like`,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId: user.id,
                            like: 0,
                        }),
                    }
                )
                const data = await response.json()

                if (!response.ok) {
                    if (data.tokenExpired) {
                        dispatch(sessionExpired({ errorToken: data.message }))
                    } else {
                        throw new Error('Une erreur est survenue.')
                    }
                } else {
                    // Inversement des valeurs pour style et décrementation :
                    setIsLiked(!isLiked)
                    setLikes(likes - 1)
                }
            }
        } catch (e) {
            console.error(e)
        }
    }

    // Ajout de Dislikes :
    async function handleClickDislike() {
        try {
            // Si l'user n'a pas disliker ou a déja liker :
            if (!isDisliked || isLiked) {
                const response = await fetch(
                    `${BASE_URL}/posts/${post._id}/like`,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId: user.id,
                            like: -1,
                        }),
                    }
                )

                const data = await response.json()

                if (!response.ok) {
                    if (data.tokenExpired) {
                        dispatch(sessionExpired({ errorToken: data.message }))
                    } else {
                        throw new Error('Une erreur est survenue.')
                    }
                } else {
                    // Inversement des valeurs pour style et incrémentation :
                    setIsDisliked(!isDisliked)
                    setDislikes(dislikes + 1)
                    if (isLiked) {
                        setIsLiked(false)
                        setLikes(likes - 1)
                    }
                }
            } else {
                // Sinon si l'user a déja disliker :
                const response = await fetch(
                    `${BASE_URL}/posts/${post._id}/like`,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId: user.id,
                            like: 0,
                        }),
                    }
                )
                const data = await response.json()

                if (!response.ok) {
                    if (data.tokenExpired) {
                        dispatch(sessionExpired({ errorToken: data.message }))
                    } else {
                        throw new Error('Une erreur est survenue.')
                    }
                } else {
                    // Inversement des valeurs pour style et décrementation :
                    setIsDisliked(!isDisliked)
                    setDislikes(dislikes - 1)
                }
            }
        } catch (e) {
            console.error(e)
        }
    }

    // Afficher le menu de suppression et de modification pour les auteurs des posts et l'admin :
    let menuDeleteUpdate

    if (user.id === post.userId || user.role === 'Admin') {
        menuDeleteUpdate = (
            <i
                className={`fa-solid fa-bars ${styles.menu}`}
                onClick={() => setShowMenuDeleteUpdate(!showMenuDeleteUpdate)}
            ></i>
        )
    } else {
        menuDeleteUpdate = null
    }

    // Définition de variable pour les classes :
    let postContainer, titleContainer, imageContainer, descriptionContainer
    let currentUrl = useLocation().pathname

    if (user.role === 'Admin' || currentUrl === '/myposts') {
        postContainer = styles.adminPost
        titleContainer = styles.adminTitleContainer
        imageContainer = styles.adminImageContainer
        descriptionContainer = styles.adminDescriptionContainer
    } else {
        postContainer = styles.post
        titleContainer = styles.titleContainer
        imageContainer = styles.imageContainer
        descriptionContainer = styles.descriptionContainer
    }

    return (
        <div className={`card ${postContainer}`}>
            <div className={styles.menuContainer}>
                {menuDeleteUpdate && <>{menuDeleteUpdate}</>}
                {showMenuDeleteUpdate && <MenuDeleteUpdate post={post} />}
            </div>
            <div className={`${titleContainer}`}>
                <h3>{post.title}</h3>
            </div>
            <p className={styles.date}>{`${dateString} à ${hourMinFormat}`}</p>
            <div className={`${imageContainer} `}>
                <img src={post.imageUrl} alt={post.title} />
            </div>
            <p className={styles.pseudo}>{`Par ${post.pseudo}.`}</p>
            <div className={`${descriptionContainer} `}>
                <p className={styles.description}>{post.description}</p>
            </div>
            <div className={styles.reactionContainer}>
                <div className={styles.likeContainer}>
                    <i
                        className={`fa-solid fa-thumbs-up ${
                            isLiked ? `${styles.isLiked}` : ''
                        }`}
                        onClick={handleClickLike}
                    ></i>
                    <span>{likes}</span>
                </div>
                <div className={styles.dislikeContainer}>
                    <i
                        className={`fa-solid fa-thumbs-up ${
                            isDisliked ? `${styles.isDisliked}` : ''
                        }`}
                        onClick={handleClickDislike}
                    ></i>
                    <span>{dislikes}</span>
                </div>
            </div>
        </div>
    )
}

export default Post

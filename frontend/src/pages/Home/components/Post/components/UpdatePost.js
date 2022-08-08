import { useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { ApiContext } from '../../../../../context/ApiContext'
import { sessionExpired } from '../../../../../redux/slices/user.slice'
import styles from './UpdatePost.module.scss'

function UpdatePost() {
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(null)
    const [image, setImage] = useState(null)
    const user = useSelector((state) => state.user)
    const BASE_URL = useContext(ApiContext)
    const dispatch = useDispatch()

    // Récupérer la props post :
    const location = useLocation()
    const { post } = location.state

    // Définir les valeur par défaut des champs du formulaire :
    const defaultValues = {
        title: post.title,
        description: post.description,
        img: '',
    }

    // Validations du formulaire de modification :
    const postSchema = yup.object({
        title: yup
            .string()
            .required('Un titre est requis.')
            .min(5, 'Votre titre est trop court.')
            .max(25, 'Votre titre est trop long.'),
        description: yup
            .string()
            .required('Une description est requise.')
            .min(3, 'Votre description est trop courte.')
            .max(
                140,
                'Votre description est trop longue. 140 caractères maximum.'
            ),
        img: yup
            .mixed()
            .test(
                'noFile',
                'Veuillez choisir une image.',
                function test(value) {
                    if (!value) {
                        return true
                    } else if (value.length === 0) {
                        return true
                    } else if (!value[0].type.includes('image')) {
                        return this.createError({
                            message:
                                'Le fichier insérer ne correspond pas à une image.',
                        })
                    } else if (value[0].size > 1024 * 1024 * 3) {
                        return this.createError({
                            message:
                                'Veuillez choisir une image inférieure à 3MO .',
                        })
                    } else {
                        return true
                    }
                }
            ),
    })

    // Import des fonctions de useForm et Lier les validations au formulaire :
    const {
        formState: { errors, isSubmitting },
        register,
        handleSubmit,
    } = useForm({
        defaultValues,
        resolver: yupResolver(postSchema),
    })

    // Afficher la nouvelle image lors du changement :
    function onImageChange(e) {
        const [file] = e.target.files
        setImage(URL.createObjectURL(file))
    }

    // Soumission du formulaire :
    async function submit(values) {
        try {
            setIsLoading(true)

            // Requete PUT avec image, FormData :
            if (values.img) {
                // Récupération des données du formulaire :
                const modifiedPost = {
                    title: values.title,
                    description: values.description,
                }

                // Création du FormData :
                let formData = new FormData()
                formData.append('image', values.img[0])
                formData.append('post', JSON.stringify(modifiedPost))

                // Envoie de la requête PUT :
                const response = await fetch(`${BASE_URL}/posts/${post._id}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                    body: formData,
                })

                // Récupération des données renvoyer par le serveur :
                const data = await response.json()

                // Gestion d'erreur :
                if (!response.ok) {
                    if (data.tokenExpired) {
                        dispatch(sessionExpired({ errorToken: data.message }))
                    } else {
                        throw new Error('Une erreur est survenue.')
                    }
                } else {
                    // Afficher message de réussite :
                    setIsSuccess(data.message)
                }
            }
            // Requete PUT sans image, JSON :
            else if (!values.img) {
                // Récupération des données du formulaire :
                const modifiedPost = {
                    title: values.title,
                    description: values.description,
                }

                // Envoie de la requête PUT :
                const response = await fetch(`${BASE_URL}/posts/${post._id}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(modifiedPost),
                })

                // Récupération des données renvoyer par le serveur :
                const data = await response.json()

                // Gestion d'erreur :
                if (!response.ok) {
                    if (data.tokenExpired) {
                        dispatch(sessionExpired({ errorToken: data.message }))
                    } else {
                        throw new Error('Une erreur est survenue.')
                    }
                } else {
                    // Afficher message de réussite :
                    setIsSuccess(data.message)
                }
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section>
            {!user.isConnected ? (
                <Navigate to="/login" replace={true} />
            ) : (
                <form className="card" onSubmit={handleSubmit(submit)}>
                    <h1>Modifier le post</h1>
                    <div className={`${styles.labelInputContainer}`}>
                        <label htmlFor="title">Titre du post</label>
                        <input type="text" id="title" {...register('title')} />
                        {errors?.title && (
                            <p className="form-error">{errors.title.message}</p>
                        )}
                    </div>
                    <div className={styles.oldImageContainer}>
                        <img src={image ? image : post.imageUrl} alt="" />
                    </div>
                    <div className={`${styles.labelInputContainer}`}>
                        <label htmlFor="img">Image</label>
                        <input
                            type="file"
                            id="img"
                            name="img"
                            {...register('img')}
                            onChange={onImageChange}
                        />
                        {errors?.img && (
                            <p className="form-error">{errors.img.message}</p>
                        )}
                    </div>
                    <div className={`${styles.labelInputContainer}`}>
                        <label htmlFor="description">Description</label>
                        <textarea
                            name="description"
                            id="description"
                            cols="30"
                            rows="10"
                            {...register('description')}
                        ></textarea>
                        {errors?.description && (
                            <p className="form-error">
                                {errors.description.message}
                            </p>
                        )}
                    </div>
                    {isLoading ? (
                        <p>Chargement...</p>
                    ) : (
                        <div>
                            {isSuccess ? (
                                <>
                                    <p>{isSuccess}</p>
                                    <Navigate to="/" replace={true} />
                                </>
                            ) : (
                                <button
                                    className="btn btn-reverse-primary"
                                    disabled={isSubmitting}
                                >
                                    Valider
                                </button>
                            )}
                        </div>
                    )}
                </form>
            )}
        </section>
    )
}

export default UpdatePost

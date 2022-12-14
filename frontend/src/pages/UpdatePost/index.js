import { useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { ApiContext } from '../../context/ApiContext'
import { sessionExpired } from '../../redux/slices/user.slice'
import styles from './UpdatePost.module.scss'
import Loader from '../../components/Loader'

function UpdatePost() {
    // States :
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(null)
    const [image, setImage] = useState(null)

    // Redux :
    const user = useSelector((state) => state.user)
    const BASE_URL = useContext(ApiContext)
    const dispatch = useDispatch()

    // Récupérer la props post :
    const location = useLocation()
    const { post, previousUrl } = location.state

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
            .min(5, 'Votre titre est trop court. 5 caractères minimum.')
            .max(40, 'Votre titre est trop long. 40 caractères maximum.'),
        description: yup
            .string()
            .required('Une description est requise.')
            .min(5, 'Votre description est trop courte. 5 caractères minimum.')
            .max(
                200,
                'Votre description est trop longue. 200 caractères maximum.'
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
        console.log(e.target.files.length)

        if (e.target.files.length === 0) {
            setImage(post.image)
        } else {
            const [file] = e.target.files
            setImage(URL.createObjectURL(file))
        }
    }

    // Soumission du formulaire :
    async function submit(values) {
        try {
            setIsLoading(true)

            // Requete PUT sans image, JSON :
            if (!values.img || values.img.length === 0) {
                // Récupération des données du formulaire :
                const modifiedPost = {
                    title: values.title,
                    description: values.description,
                    userId: user.id,
                    pseudo: user.pseudo,
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
            // Requete PUT avec image, FormData :
            else if (values.img) {
                // Récupération des données du formulaire :
                const modifiedPost = {
                    title: values.title,
                    description: values.description,
                    userId: user.id,
                    pseudo: user.pseudo,
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
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className={styles.updateContainer}>
            {!user.isConnected ? (
                <Navigate to="/login" replace={true} />
            ) : (
                <form
                    className={`card ${styles.formUpdatePost}`}
                    onSubmit={handleSubmit(submit)}
                >
                    <h1>Modifier le post</h1>
                    <div className={`${styles.labelInputContainer}`}>
                        <label htmlFor="title">Titre du post</label>
                        <input type="text" id="title" {...register('title')} />
                        {errors?.title && (
                            <p className="form-error">{errors.title.message}</p>
                        )}
                    </div>
                    <div className={`${styles.labelInputContainer}`}>
                        <label htmlFor="img">Image du post</label>
                        <div className={styles.imageContainer}>
                            <img
                                src={image ? image : post.imageUrl}
                                alt={post.title}
                            />
                        </div>
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
                        <label htmlFor="description">Description du post</label>
                        <textarea
                            name="description"
                            id="description"
                            cols="30"
                            rows="10"
                            wrap="soft"
                            {...register('description')}
                        ></textarea>
                        {errors?.description && (
                            <p className="form-error">
                                {errors.description.message}
                            </p>
                        )}
                    </div>
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <>
                            {isSuccess ? (
                                <>
                                    <p>{isSuccess}</p>
                                    <Navigate to={previousUrl} replace={true} />
                                </>
                            ) : (
                                <button
                                    type="submit"
                                    className="btn btn-reverse-primary"
                                    disabled={isSubmitting}
                                >
                                    Valider la modification
                                </button>
                            )}
                        </>
                    )}
                </form>
            )}
        </main>
    )
}

export default UpdatePost

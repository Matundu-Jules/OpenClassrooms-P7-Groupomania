import { useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { ApiContext } from '../../context/ApiContext'
import { sessionExpired } from '../../redux/slices/user.slice'
import styles from './CreatePost.module.scss'
import Loader from '../../components/Loader'

function CreatePost() {
    // States :
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(null)
    const [image, setImage] = useState(null)
    const [imageName, setImageName] = useState('')

    // Redux :
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()

    // Context :
    const BASE_URL = useContext(ApiContext)

    // Valeurs par défaut du formulaire //
    const defaultValues = {
        title: '',
        description: '',
        img: '',
    }

    // Schema de validations pour le formulaire //
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
                        return this.createError({
                            message: 'Veuillez choisir une image.',
                        })
                    } else if (value.length === 0) {
                        return this.createError({
                            message: 'Veuillez choisir une image.',
                        })
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

    // Importation des fonctions et connexion du schema via le resolver Yup //
    const {
        formState: { errors, isSubmitting },
        register,
        handleSubmit,
        reset,
    } = useForm({
        defaultValues,
        resolver: yupResolver(postSchema),
    })

    // Soumission du formulaire //
    async function submit(values) {
        try {
            setIsLoading(true)

            // Récupération des valeurs :
            const { img, ...post } = values
            const image = img[0]
            post.userId = user.id
            post.pseudo = user.pseudo

            // Création du FormData :
            let formData = new FormData()
            formData.append('image', image)
            formData.append('post', JSON.stringify(post))

            // Requête POST :
            const response = await fetch(`${BASE_URL}/posts`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
                body: formData,
            })

            const data = await response.json()

            // Vérification et renvoie des erreurs si la requête échoue :
            if (!response.ok) {
                if (data.tokenExpired) {
                    dispatch(sessionExpired({ errorToken: data.message }))
                } else {
                    throw new Error('Une erreur est survenue.')
                }
            } else {
                reset(defaultValues)
                setIsSuccess(data.message)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    // Afficher la nouvelle image lors d'un changement :
    function onImageChange(e) {
        if (e.target.files.length === 0) {
            setImage(null)
            setImageName('')
        } else {
            const [file] = e.target.files
            setImage(URL.createObjectURL(file))
            setImageName(file.name.split('.')[0])
        }
    }

    return (
        <main className={styles.createPostContainer}>
            {!user.isConnected ? (
                <Navigate to="/login" replace={true} />
            ) : (
                <form
                    className={`card ${styles.formCreatePost}`}
                    onSubmit={handleSubmit(submit)}
                >
                    <h1 className={styles.titleCreatePost}>Créer un post</h1>
                    {/* Titre */}
                    <div className={`${styles.labelInputContainer}`}>
                        <label htmlFor="title">Titre du post</label>
                        <input type="text" id="title" {...register('title')} />
                        {errors?.title && (
                            <p className="form-error">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Image */}
                    <div className={`${styles.labelInputContainer}`}>
                        <label htmlFor="img">Image du post</label>
                        {image && (
                            <div className={styles.imageContainer}>
                                <img
                                    src={image && image}
                                    alt={image && imageName}
                                />
                            </div>
                        )}
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

                    {/* Description */}
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

                    {/* 
                    Si les datas chargent affiche le loader et si le post est crée => redirection.
                    Sinon afficher le bouton.
                     */}
                    {isLoading ? (
                        <Loader />
                    ) : (
                        <>
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
                                    Créer le post
                                </button>
                            )}
                        </>
                    )}
                </form>
            )}
        </main>
    )
}

export default CreatePost

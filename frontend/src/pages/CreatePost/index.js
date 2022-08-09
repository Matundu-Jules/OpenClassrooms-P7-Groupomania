import { useContext, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { ApiContext } from '../../context/ApiContext'
import { sessionExpired } from '../../redux/slices/user.slice'
import styles from './CreatePost.module.scss'

function CreatePost() {
    const [isLoading, setIsLoading] = useState(false)
    const user = useSelector((state) => state.user)
    const BASE_URL = useContext(ApiContext)
    const dispatch = useDispatch()
    const defaultValues = {
        title: '',
        description: '',
        img: '',
    }

    const postSchema = yup.object({
        title: yup
            .string()
            .required('Un titre est requis.')
            .min(5, 'Votre titre est trop court.')
            .max(40, 'Votre titre est trop long.'),
        description: yup
            .string()
            .required('Une description est requise.')
            .min(3, 'Votre description est trop courte.')
            .max(
                360,
                'Votre description est trop longue. 360 caractères maximum.'
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

    const {
        formState: { errors, isSubmitting },
        register,
        handleSubmit,
        reset,
    } = useForm({
        defaultValues,
        resolver: yupResolver(postSchema),
    })

    async function submit(values) {
        try {
            setIsLoading(true)

            const { img, ...post } = values
            const image = img[0]
            post.userId = user.id
            post.pseudo = user.pseudo

            let formData = new FormData()
            formData.append('image', image)
            formData.append('post', JSON.stringify(post))

            const response = await fetch(`${BASE_URL}/posts`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
                body: formData,
            })

            const data = await response.json()

            if (!response.ok) {
                if (data.tokenExpired) {
                    dispatch(sessionExpired({ errorToken: data.message }))
                } else {
                    throw new Error('Une erreur est survenue.')
                }
            } else {
                reset(defaultValues)
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
                    <h1>Créer un post</h1>
                    <div className={`${styles.labelInputContainer}`}>
                        <label htmlFor="title">Titre du post</label>
                        <input type="text" id="title" {...register('title')} />
                        {errors?.title && (
                            <p className="form-error">{errors.title.message}</p>
                        )}
                    </div>
                    <div className={`${styles.labelInputContainer}`}>
                        <label htmlFor="img">Image</label>
                        <input
                            type="file"
                            id="img"
                            name="img"
                            {...register('img')}
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
                        <button
                            className="btn btn-reverse-primary"
                            disabled={isSubmitting}
                        >
                            Valider
                        </button>
                    )}
                </form>
            )}
        </section>
    )
}

export default CreatePost

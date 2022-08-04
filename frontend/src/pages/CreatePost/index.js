import { useState } from 'react'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import styles from './CreatePost.module.scss'

function CreatePost() {
    const [isLoading, setIsLoading] = useState(false)
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
            .max(15, 'Votre titre est trop long.'),
        description: yup
            .string()
            .required('Une description est requise.')
            .min(3, 'Votre description est trop courte.')
            .max(40, 'Votre description est trop longue.'),
        img: yup
            .mixed()
            .test(
                'noFile',
                'Veuillez choisir une image.',
                function test(value) {
                    console.log(value)
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
                    } else if (value[0].size > 2000000) {
                        return this.createError({
                            message:
                                'Veuillez choisir une image inférieure à 2MB .',
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
        setError,
        clearErrors,
    } = useForm({
        defaultValues,
        resolver: yupResolver(postSchema),
    })

    function submit(values) {
        console.log(values)
        const { title, description, img } = values
        console.log('title', title)
        console.log('description', description)
        // Accéder au type du fichier :
        console.log('img', img[0].type)
    }

    return (
        <section>
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
                    <input type="file" id="img" {...register('img')} />
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
        </section>
    )
}

export default CreatePost

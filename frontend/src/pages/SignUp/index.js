import { useContext, useState } from 'react'
import { Navigate } from 'react-router-dom'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ApiContext } from '../../context/ApiContext'
import styles from './SignUp.module.scss'

function SignUp() {
    const [success, setSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const BASE_URL = useContext(ApiContext)
    const defaultValues = {
        pseudo: '',
        email: '',
        password: '',
        confirmPassword: '',
    }

    // Yup Schema :
    const authSchema = yup.object({
        pseudo: yup
            .string()
            .required('Un pseudo est requis.')
            .min(3, 'Le pseudo est trop court.'),
        email: yup
            .string()
            .email('Veuillez entrer une adresse email valide.')
            .required('Une adresse email est requise.'),
        password: yup
            .string()
            .required('Le mot de passe est obligatoire.')
            .min(5, 'Votre mot de passe est trop court, minimum 5 caractères.'),
        confirmPassword: yup
            .string()
            .required('Vous devez confirmer votre mot de passe !')
            .oneOf(
                [yup.ref('password'), ''],
                'Les mots de passes ne correspondent pas !'
            ),
    })

    //
    const {
        formState: { errors, isSubmitting },
        register,
        handleSubmit,
        reset,
        setError,
        clearErrors,
    } = useForm({
        defaultValues,
        resolver: yupResolver(authSchema),
    })

    // POST : Création nouvel utilisateur
    async function submit(values) {
        const { confirmPassword, ...newUser } = values
        // console.log(values)

        clearErrors()

        try {
            setIsLoading(true)
            const response = await fetch(`${BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            })
            // console.log(response)
            const data = await response.json()
            console.log(data)
            if (!response.ok) {
                if (!data.userCreated) {
                    setError('pseudoExist', {
                        type: 'pseudoExist',
                        message: data.errorPseudo,
                    })
                    setError('emailExist', {
                        type: 'emailExist',
                        message: data.errorEmail,
                    })
                } else {
                    throw new Error('Une erreur est survenue.')
                }
            } else {
                reset(defaultValues)
                setSuccess(true)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section>
            {success ? (
                <Navigate to="/" replace={true} />
            ) : (
                <form className="card" onSubmit={handleSubmit(submit)}>
                    <h1>Inscription</h1>
                    <div className={`${styles.labelInputContainer}`}>
                        <label htmlFor="pseudo">Pseudo</label>
                        <input
                            type="text"
                            id="pseudo"
                            {...register('pseudo')}
                        />
                        {errors?.pseudo ? (
                            <p className="form-error">
                                {errors.pseudo.message}
                            </p>
                        ) : errors.pseudoExist ? (
                            <p className="form-error">
                                {errors.pseudoExist.message}
                            </p>
                        ) : (
                            ''
                        )}
                    </div>
                    <div className={`${styles.labelInputContainer}`}>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" {...register('email')} />
                        {errors?.email ? (
                            <p className="form-error">{errors.email.message}</p>
                        ) : errors.emailExist ? (
                            <p className="form-error">
                                {errors.emailExist.message}
                            </p>
                        ) : (
                            ''
                        )}
                    </div>
                    <div className={`${styles.labelInputContainer}`}>
                        <label htmlFor="password">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            {...register('password')}
                        />
                        {errors?.password && (
                            <p className="form-error">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                    <div className={`${styles.labelInputContainer}`}>
                        <label htmlFor="confirmPassword">
                            Confirmation du mot de passe
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            {...register('confirmPassword')}
                        />
                        {errors?.confirmPassword && (
                            <p className="form-error">
                                {errors.confirmPassword.message}
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

export default SignUp

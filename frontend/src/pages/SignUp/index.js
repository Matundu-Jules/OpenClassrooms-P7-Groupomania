import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ApiContext } from '../../context/ApiContext'
import styles from './SignUp.module.scss'
import Loader from '../../components/Loader'

function SignUp() {
    // State :
    const [isLoading, setIsLoading] = useState(false)

    // Context :
    const BASE_URL = useContext(ApiContext)

    // Importation de useNavigate pour créer une redirection et passer une props :
    let navigate = useNavigate()

    // Valeurs par défaut du formulaire :
    const defaultValues = {
        pseudo: '',
        email: '',
        password: '',
        confirmPassword: '',
    }

    // Schema de validations pour le formulaire :
    const authSchema = yup.object({
        pseudo: yup
            .string()
            .required('Un pseudo est requis.')
            .trim('Veuillez supprimer les espaces avant/après votre pseudo.')
            .strict(true)
            .min(3, 'Le pseudo est trop court.')
            .max(15, 'Le pseudo est trop grand.'),
        email: yup
            .string()
            .email('Veuillez entrer une adresse email valide.')
            .required('Une adresse email est requise.'),
        password: yup
            .string()
            .required('Le mot de passe est obligatoire.')
            .min(
                10,
                'Votre mot de passe est trop court, minimum 10 caractères.'
            ),
        confirmPassword: yup
            .string()
            .required('Vous devez confirmer votre mot de passe !')
            .oneOf(
                [yup.ref('password'), ''],
                'Les mots de passes ne correspondent pas !'
            ),
    })

    // Import des fonctions de useForm et Lier les validations au formulaire :
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

    // Soumission du formulaire //
    async function submit(values) {
        clearErrors()

        // Récupération des valeurs :
        const { confirmPassword, ...newUser } = values

        try {
            setIsLoading(true)

            // Requête POST - Création nouvel utilisateur :
            const response = await fetch(`${BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            })

            const data = await response.json()

            // Gestion d'erreur :
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

                // Redirection avec msg de confirmation de création de compte :
                navigate('/login', {
                    replace: true,
                    state: data.message,
                })
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className={styles.signupContainer}>
            <form
                className={`card ${styles.formSignup}`}
                onSubmit={handleSubmit(submit)}
            >
                <h1>Créer un compte</h1>
                <p>
                    Pour pouvoir rejoindre notre communauté, inscrivez-vous dès
                    maintenant !
                </p>
                <div className={`${styles.labelInputContainer}`}>
                    <label htmlFor="pseudo">Pseudo</label>
                    <input type="text" id="pseudo" {...register('pseudo')} />
                    {errors?.pseudo ? (
                        <p className="form-error">{errors.pseudo.message}</p>
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
                        <p className="form-error">{errors.password.message}</p>
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
                    <Loader />
                ) : (
                    <button
                        className="btn btn-reverse-primary"
                        disabled={isSubmitting}
                    >
                        Valider mon inscription
                    </button>
                )}
            </form>
        </main>
    )
}

export default SignUp

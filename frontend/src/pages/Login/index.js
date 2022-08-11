import { useContext, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ApiContext } from '../../context/ApiContext'
import styles from './Login.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../../components/Loader'

function Login() {
    // State :
    const [isLoading, setIsLoading] = useState(false)

    // Redux :
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()

    // Context :
    const BASE_URL = useContext(ApiContext)

    // Récupération du msg pour confirmer la création de compte :
    const { state: msgUserCreated } = useLocation()

    // Valeur par défaut du fomulaire :
    const defaultValues = {
        email: '',
        password: '',
    }

    // Schema de validation du formulaire :
    const loginSchema = yup.object({
        email: yup
            .string()
            .email('Veuillez entrer une adresse email valide.')
            .required('Une adresse email est requise.'),
        password: yup.string().required('Le mot de passe est obligatoire.'),
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
        resolver: yupResolver(loginSchema),
    })

    async function submit(values) {
        clearErrors()
        try {
            setIsLoading(true)

            // Requête POST - Connexion :
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            })

            const data = await response.json()

            // Gestion d'erreur :
            if (!response.ok) {
                if (data.wrongLogin) {
                    setError('emailExist', {
                        type: 'emailExist',
                        message: data.errorEmail,
                    })
                    setError('wrongPassword', {
                        type: 'wrongPassword',
                        message: data.errorPassword,
                    })
                } else {
                    throw new Error('Une erreur est survenue.')
                }
            } else {
                reset(defaultValues)

                // Ajouter tout les infos de l'user dans le state "user" gérer par Redux :
                dispatch({
                    type: 'user/login',
                    payload: {
                        id: data.userId,
                        token: data.token,
                        pseudo: data.pseudo,
                        createdAt: data.createdAt,
                        role: data.role,
                        isConnected: true,
                    },
                })
            }
        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section>
            {user.isConnected ? (
                <Navigate to="/" replace={true} />
            ) : (
                <form
                    className={`card ${styles.loginForm}`}
                    onSubmit={handleSubmit(submit)}
                >
                    {msgUserCreated && (
                        <p className={styles.msgUserCreated}>
                            {msgUserCreated}
                        </p>
                    )}
                    {user.errorToken && (
                        <p className="form-error">{user.errorToken}</p>
                    )}
                    <h1>Connexion</h1>
                    <div className={`${styles.labelInputContainer}`}>
                        <label htmlFor="email">Email</label>
                        <input type="text" id="email" {...register('email')} />
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
                        {errors?.password ? (
                            <p className="form-error">
                                {errors.password.message}
                            </p>
                        ) : errors.wrongPassword ? (
                            <p className="form-error">
                                {errors.wrongPassword.message}
                            </p>
                        ) : (
                            ''
                        )}
                    </div>
                    {isLoading ? (
                        <Loader />
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

export default Login

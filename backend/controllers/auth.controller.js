const bcrypt = require('bcrypt')
const { createJwtToken } = require('../config/jwt.config')
const User = require('../models/user.model')
const { emailExistQuery, pseudoExistQuery } = require('../queries/auth.queries')

// Création nouvel utilisateur :
exports.userSignup = async (req, res, next) => {
    try {
        const pseudoExist = await pseudoExistQuery(req.body.pseudo)
        const emailExist = await emailExistQuery(req.body.email)

        if (pseudoExist && emailExist) {
            return res.status(400).json({
                userCreated: false,
                errorPseudo:
                    'Ce pseudo est déja pris, veuillez en choisir un nouveau.',
                errorEmail: 'Cet email est déja associé à un compte !',
            })
        } else if (pseudoExist) {
            return res.status(400).json({
                userCreated: false,
                errorPseudo:
                    'Ce pseudo est déja pris, veuillez en choisir un nouveau.',
            })
        } else if (emailExist) {
            return res.status(400).json({
                userCreated: false,
                errorEmail: 'Cet email est déja associé à un compte !',
            })
        }

        // Hashage du mot de passe :
        const salt = await bcrypt.genSalt(15)
        const hash = await bcrypt.hash(req.body.password, salt)

        // Création de l'user :
        const user = new User({
            pseudo: req.body.pseudo,
            email: req.body.email,
            password: hash,
            // createdAt: new Date(),
        })

        // Enregistrement de l'user dans la BDD :
        await user.save()

        // Envoie de la réponse :
        res.status(201).json({
            userCreated: true,
            message: 'Votre compte a bien été créer.',
        })
        next()
    } catch (err) {
        return next(err)
    }
}

// Connexion utilisateur :
exports.userLogin = async (req, res, next) => {
    try {
        // Récupération de l'user via l'email si existant :
        const user = await emailExistQuery(req.body.email)

        // Si le user n'existe pas alors on retourne une erreur :
        if (!user) {
            return res.status(404).json({
                wrongLogin: true,
                errorEmail:
                    'Cet email est associé à aucun compte, veuillez vous inscrire.',
            })
        } else {
            // Si l'user existe on vérifie le mot de passe de la requete comparé à celui de la bdd :
            const passwordIsValid = await bcrypt.compare(
                req.body.password,
                user.password
            )

            // Si les password ne sont pas les mêmes alors on retourne une erreur :
            if (!passwordIsValid) {
                return res.status(401).json({
                    wrongLogin: true,
                    errorPassword: 'Mot de passe incorrect',
                })
            } else if (user && passwordIsValid) {
                // Sinon si tout est ok, on renvoie un statut 200 et json contenant l'userId et un token web JSON signé.
                return res.status(200).json({
                    userId: user._id,
                    pseudo: user.pseudo,
                    createdAt: user.createdAt,
                    role: user.role,
                    token: createJwtToken(user),
                })
            } else {
                throw new Error('Une erreur est survenue.')
            }
        }
    } catch (err) {
        return next(err)
    }
}

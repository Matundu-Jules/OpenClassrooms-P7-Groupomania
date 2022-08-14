const yup = require('yup')

// Validation pour la création d'utilisateur //
const userSchema = yup.object({
    pseudo: yup
        .string()
        .trim('Veuillez supprimer les espaces avant/après votre pseudo.')
        .strict(true)
        .min(3, 'Le pseudo est trop court.')
        .max(15, 'Le pseudo est trop grand.')
        .required('Un pseudo est requis.'),
    email: yup
        .string()
        .email('Veuillez entrer une adresse email valide.')
        .required('Une adresse email est requise.'),
    password: yup
        .string()
        .required('Une adresse email est requise.')
        .min(10, 'Votre mot de passe est trop court, minimum 10 caractères.'),
})

module.exports = userSchema

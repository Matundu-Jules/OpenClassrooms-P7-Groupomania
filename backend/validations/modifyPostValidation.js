const yup = require('yup')

// Validation pour la modification de post //
const modifyPostSchema = yup.object({
    title: yup
        .string()
        .min(5, 'Votre titre est trop court. 5 caractères minimum.')
        .max(40, 'Votre titre est trop long. 40 caractères maximum.')
        .required('Un titre est requis.'),
    description: yup
        .string()
        .min(5, 'Votre description est trop courte. 5 caractères minimum.')
        .max(200, 'Votre description est trop longue. 200 caractères maximum.')
        .required('Une description est requise.'),
    userId: yup.string().required('Votre userId est requis.'),
    pseudo: yup.string().required('Votre pseudo est requis.'),

    image: yup
        .mixed()
        .test('noFile', 'Veuillez choisir une image.', function test(value) {
            if (!value) {
                return true
            } else if (!value.fieldname.includes('image')) {
                return this.createError({
                    message:
                        'Le fichier insérer ne correspond pas à une image.',
                })
            } else if (value.size > 1024 * 1024 * 3) {
                return this.createError({
                    message: 'Veuillez choisir une image inférieure à 3MO .',
                })
            } else {
                return true
            }
        }),
})

module.exports = modifyPostSchema

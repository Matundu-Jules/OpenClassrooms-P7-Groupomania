const yup = require('yup')

// Validation pour la modification de post //
const modifyPostSchema = yup.object({
    title: yup.string().min(5).max(40).required(),
    description: yup.string().min(5).max(200).required(),
    userId: yup.string().required(),
    pseudo: yup.string().required(),

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

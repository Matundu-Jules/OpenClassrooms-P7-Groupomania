const modifyValidation = (schema) => async (req, res, next) => {
    let dataForValidation
    let post

    if (req.file) {
        post = JSON.parse(req.body.post)
        dataForValidation = {
            ...post,
            image: req.file,
        }
    } else if (!req.file && req.body.post) {
        return res.status(400).json({
            errorMessage:
                "Si vous ne souhaitez pas mettre à jour l'image, merci d'envoyer du JSON.",
        })
    } else {
        post = req.body
        dataForValidation = { ...req.body }
    }

    // Erreur userId :
    if (post.userId !== req.user.userId) {
        return res.status(401).json({
            errorMessage:
                "Votre userId ne correspond pas à celui de l'utilisateur.",
        })
    }

    // Erreur pseudo :
    if (post.pseudo !== req.user.pseudo) {
        return res.status(401).json({
            errorMessage:
                "Votre pseudo ne correspond pas à celui de l'utilisateur.",
        })
    }

    try {
        await schema.validate(dataForValidation)
        next()
    } catch (err) {
        return res.status(400).json({ err })
    }
}

module.exports = modifyValidation

const validation = (schema) => async (req, res, next) => {
    const post = JSON.parse(req.body.post)

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

    const dataForValidation = {
        ...post,
        image: req.file,
    }

    try {
        await schema.validate(dataForValidation)
        next()
    } catch (err) {
        return res.status(400).json({ err })
    }
}

module.exports = validation

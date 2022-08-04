const Post = require('../models/post.model')
const {
    getPostQuery,
    getAllpostsQuery,
    modifyPostQuery,
    deletePostQuery,
} = require('../queries/posts.queries')
const path = require('path')
const fs = require('fs')

// Création de post :
exports.createPost = async (req, res, next) => {
    try {
        const postObject = JSON.parse(req.body.post)

        // Création de la post à partir des données formulaire :
        const post = new Post({
            ...postObject,
            imageUrl: `${req.protocol}://${req.get('host')}/uploads/images/${
                req.file.filename
            }`,
            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: [],
            createdAt: new Date(),
        })
        await post.save()

        res.status(201).json({ message: 'Votre post a bien été créer !' })
    } catch (err) {
        next(err)
    }
}

// Récupération de toutes les posts :
exports.getAllposts = async (req, res, next) => {
    try {
        const posts = await getAllpostsQuery()
        res.status(200).json(posts)
    } catch (err) {
        next(err)
    }
}

// Récupération d'une post :
exports.getPost = async (req, res, next) => {
    try {
        // Récupération id passé dans l'url :
        const postId = req.params.id

        // Récupération de la post via son Id :
        const post = await getPostQuery(postId)
        res.status(200).json(post)
    } catch (err) {
        next(err)
    }
}

// Modifier une post :
exports.modifyPost = async (req, res, next) => {
    try {
        const postId = req.params.id
        const post = await getPostQuery(postId)

        if (post.userId !== req.user.userId) {
            res.status(403)
            throw new Error('403: Unauthorized request.')
        }

        let modifiedPost

        // Si une nouvelle img est ajouté alors on l'enregistre et on supprime l'ancienne du répertoire :
        if (req.file) {
            modifiedPost = {
                ...JSON.parse(req.body.post),
                imageUrl: `${req.protocol}://${req.get(
                    'host'
                )}/uploads/images/${req.file.filename}`,
            }

            // Récupérer l'url de l'ancienne image de la post :
            const imgUrl = post.imageUrl

            // Création u path pour supprimer l'ancienne image :
            const path = './uploads/images/' + imgUrl.split('/images/')[1]

            // Suppression de l'ancienne image :
            fs.unlink(path, (err) => {
                if (err) throw err
                console.log('Fichier supprimé !')
            })
        }

        // Si aucune image n'est reçue lors de la modification alors on récupère uniquement les données via le body :
        if (!req.file) {
            modifiedPost = { ...req.body }
        }

        // Appliquer les modification dans la base de données :
        await modifyPostQuery(postId, modifiedPost)
        res.status(201).json({
            message: 'La modification de la post a bien été effectuer.',
        })
    } catch (err) {
        next(err)
    }
}

// Suppression de post :
exports.deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id
        const post = await getPostQuery(postId)

        if (post.userId !== req.user.userId) {
            res.status(403)
            throw new Error('403: Unauthorized request.')
        }

        await deletePostQuery(postId)

        const imgUrl = post.imageUrl
        const path = './uploads/images/' + imgUrl.split('/images/')[1]

        fs.unlink(path, (err) => {
            if (err) throw err
            console.log('Fichier supprimé !')
        })

        res.status(200).json({ message: 'La post a bien été supprimé !' })
    } catch (err) {
        next(err)
    }
}

// Ajout de like et dislike :
exports.addLike = async (req, res, next) => {
    try {
        const postId = req.params.id
        const userId = req.body.userId

        const post = await getPostQuery(postId)
        const indexLike = post.usersLiked.indexOf(userId)
        const indexDislike = post.usersDisliked.indexOf(userId)

        // Si on tente d'envoyer autre chose que -1, 0, ou 1, alors renvoyer une erreur :
        if (req.body.like < -1 || req.body.like > 1 || isNaN(req.body.like)) {
            res.status(400)
            throw new Error(
                `Cette valeur n'est pas acceptée : ${req.body.like}`
            )
        }

        // Ajout de Like :
        if (req.body.like === 1) {
            // Si l'user a déja liker, retourner une erreur :
            if (indexLike !== -1) {
                res.status(400)
                throw new Error('Vous avez déja liker cette post.')
            }

            // Si l'user a déja disliker, supprimer le dislike :
            if (indexDislike !== -1) {
                post.dislikes--
                const newArray = post.usersDisliked.filter((id) => id != userId)
                post.usersDisliked = newArray
            }

            // Ajouter le like :
            post.usersLiked.push(userId)
            post.likes++
            await post.save()
            res.status(200).json({ message: 'Votre like a été ajouté !' })
        }

        // Ajout de Dislike :
        if (req.body.like === -1) {
            // Si l'user a déja disliker, retourner une erreur :
            if (indexDislike !== -1) {
                res.status(400)
                throw new Error('Vous avez déja disliker cette post.')
            }

            // Si l'user a déja liker, supprimer le like :
            if (indexLike !== -1) {
                post.likes--
                const newArray = post.usersLiked.filter((id) => id != userId)
                post.usersLiked = newArray
            }

            // Ajouter le dislike :
            post.usersDisliked.push(userId)
            post.dislikes++
            await post.save()
            res.status(200).json({ message: 'Votre dislike a été ajouté !' })
        }

        // Enlever son like / dislike :
        if (req.body.like === 0) {
            if (indexLike > -1) {
                post.likes--
                const newArray = post.usersLiked.filter((id) => id != userId)
                post.usersLiked = newArray
                await post.save()
                res.status(200).json({ message: 'Votre like a été supprimé !' })
            }

            if (indexDislike > -1) {
                post.dislikes--
                const newArray = post.usersDisliked.filter((id) => id != userId)
                post.usersDisliked = newArray
                await post.save()
                res.status(200).json({
                    message: 'Votre dislike a été supprimé !',
                })
            }
        }
    } catch (err) {
        next(err)
    }
}

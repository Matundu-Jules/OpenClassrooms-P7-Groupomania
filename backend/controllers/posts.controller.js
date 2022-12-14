const Post = require('../models/post.model')
const {
    getPostQuery,
    getAllPostsQuery,
    getUserPostsQuery,
    modifyPostQuery,
    deletePostQuery,
} = require('../queries/posts.queries')
const path = require('path')
const fs = require('fs')

// Création de post //
exports.createPost = async (req, res, next) => {
    try {
        const postObject = JSON.parse(req.body.post)

        // Création d'un post à partir des données formulaire :
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
        return next(err)
    }
}

// Récupération de tout les posts //
exports.getAllposts = async (req, res, next) => {
    try {
        const posts = await getAllPostsQuery()
        res.status(200).json(posts)
    } catch (err) {
        return next(err)
    }
}

// Récupération de tout les posts d'un user //
exports.getUserPosts = async (req, res, next) => {
    try {
        const userId = req.params.userId

        if (req.user.userId !== userId) {
            return res.status(403).json({
                errorMsg: "Vous n'êtes pas autoriser à éffectuer cette action.",
            })
        }

        // Récupération des posts de l'utilisateur :
        const posts = await getUserPostsQuery(userId)

        res.status(200).json(posts)
    } catch (err) {
        return next(err)
    }
}

// Modifier un post //
exports.modifyPost = async (req, res, next) => {
    try {
        const postId = req.params.id
        const post = await getPostQuery(postId)

        // Si l'id de l'user est différent de celui qui a creer le post ou si ce n'est pas l'admin :
        if (post.userId !== req.user.userId && req.user.role !== 'Admin') {
            return res.status(403).json({
                errorMessage:
                    "Vous n'êtes pas autoriser à effectuer cette action.",
            })
        } else if (
            post.userId === req.user.userId ||
            req.user.role === 'Admin'
        ) {
            let modifiedPost

            // Si une nouvelle img est ajouté alors on l'enregistre et on supprime l'ancienne du répertoire :
            if (req.file) {
                modifiedPost = {
                    ...JSON.parse(req.body.post),
                    imageUrl: `${req.protocol}://${req.get(
                        'host'
                    )}/uploads/images/${req.file.filename}`,
                }

                // Récupérer l'url de l'ancienne image du post :
                const imgUrl = post.imageUrl

                // Création d'un path pour supprimer l'ancienne image :
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
                message: 'La modification du post a bien été effectuer.',
            })
        }
    } catch (err) {
        return next(err)
    }
}

// Suppression de post //
exports.deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id
        const post = await getPostQuery(postId)

        if (post.userId !== req.user.userId && req.user.role !== 'Admin') {
            return res.status(403).json({
                errorMessage:
                    "Vous n'êtes pas autoriser à effectuer cette action.",
            })
        } else if (
            post.userId === req.user.userId ||
            req.user.role === 'Admin'
        ) {
            await deletePostQuery(postId)

            const imgUrl = post.imageUrl
            const path = './uploads/images/' + imgUrl.split('/images/')[1]

            fs.unlink(path, (err) => {
                if (err) throw err
                console.log('Fichier supprimé !')
            })

            res.status(200).json({ message: 'Le post a bien été supprimé !' })
        }
    } catch (err) {
        return next(err)
    }
}

// Ajout de like et dislike //
exports.addLike = async (req, res, next) => {
    try {
        const postId = req.params.id
        const userId = req.body.userId

        const post = await getPostQuery(postId)
        const indexLike = post.usersLiked.indexOf(userId)
        const indexDislike = post.usersDisliked.indexOf(userId)

        if (userId != req.user.userId) {
            return res.status(401).json({
                message:
                    "L'userId envoyé n'est pas le votre. Vous n'êtes pas autorisé à effectuer cette action.",
            })
        }

        // Si on tente d'envoyer autre chose que -1, 0, ou 1, alors renvoyer une erreur :
        if (req.body.like < -1 || req.body.like > 1 || isNaN(req.body.like)) {
            return res.status(400).json({
                errorMessage: `Cette valeur n'est pas acceptée : ${req.body.like}`,
            })
        }

        // Ajout de Like //
        if (req.body.like === 1) {
            // Si l'user a déja liker, retourner une erreur :
            if (indexLike !== -1) {
                return res
                    .status(400)
                    .json({ errorMessage: 'Vous avez déja liker ce post.' })
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
            return res
                .status(200)
                .json({ message: 'Votre like a été ajouté !' })
        }

        // Ajout de Dislike //
        if (req.body.like === -1) {
            // Si l'user a déja disliker, retourner une erreur :
            if (indexDislike !== -1) {
                return res.status(400).json({
                    errorMessage: 'Vous avez déja disliker ce post.',
                })
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
            return res
                .status(200)
                .json({ message: 'Votre dislike a été ajouté !' })
        }

        // Enlever son like / dislike //
        if (req.body.like === 0) {
            // Retourne une erreur si l'user n'a pas liker / disliker :
            if (indexLike === -1 && indexDislike === -1) {
                return res.status(404).json({
                    message:
                        "Vous n'avez pas encore liker ou disliker ce post.",
                })
            }

            // Si l'user a liker, on supprime le like :
            if (indexLike > -1) {
                post.likes--
                const newArray = post.usersLiked.filter((id) => id != userId)
                post.usersLiked = newArray
                await post.save()
                return res
                    .status(200)
                    .json({ message: 'Votre like a été supprimé !' })
            }

            // Si l'user a disliker, on supprime le dislike :
            if (indexDislike > -1) {
                post.dislikes--
                const newArray = post.usersDisliked.filter((id) => id != userId)
                post.usersDisliked = newArray
                await post.save()
                return res.status(200).json({
                    message: 'Votre dislike a été supprimé !',
                })
            }
        }
    } catch (err) {
        return next(err)
    }
}

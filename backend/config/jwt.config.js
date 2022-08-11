const dotenv = require('dotenv').config()
const jwt = require('jsonwebtoken')
const secret = process.env.ACCESS_TOKEN_SECRET

// Création du token JWT :
exports.createJwtToken = (user) => {
    const jwtToken = jwt.sign(
        {
            sub: user._id.toString(),
            role: user.role,
            pseudo: user.pseudo,
        },
        secret,
        { expiresIn: '1h' }
    )

    return jwtToken
}

// Vérification du token :
exports.verifyJwtToken = (req, res, next) => {
    try {
        // Récupération du token :
        const token = req.headers.authorization.split(' ')[1]

        // Retourner une une erreur si le token n'est plus valide, ou n'est pas valide :
        try {
            jwt.verify(token, secret)
        } catch (e) {
            return res.status(401).json({
                tokenExpired: true,
                message: 'Votre session à expirer, Veuillez vous reconnecter.',
            })
        }

        // Vérification et récupération des valeurs du token :
        const decodedToken = jwt.verify(token, secret)
        const { sub: userId, role, pseudo } = decodedToken

        // Création de la key req.user pour créer des vérification sur les routes :
        req.user = { userId, role, pseudo }

        // Message d'erreur si le token n'appartient pas au même utilisateur :
        if (req.body.userId && req.user.userId !== userId) {
            return res.status(401).json({
                message: "Token d'authentification invalide !",
            })
        }
        next()
    } catch (err) {
        next(err)
    }
}

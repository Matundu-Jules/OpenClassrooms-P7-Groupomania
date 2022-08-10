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

        try {
            jwt.verify(token, secret)
        } catch (e) {
            res.status(401).json({
                tokenExpired: true,
                message: 'Votre session à expirer, Veuillez vous reconnecter.',
            })
        }

        // Vérification du token :
        const decodedToken = jwt.verify(token, secret)

        const { sub: userId, role, pseudo } = decodedToken
        req.user = { userId, role, pseudo }

        if (req.body.userId && req.user.userId !== userId) {
            throw new Error("Token d'authentification invalide !")
        }
        next()
    } catch (err) {
        next(err)
    }
}

const jwt = require('jsonwebtoken');
const config = require('../config');

function verifyToken(req, res, next){
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(401).json({
            auth: false,
            message:'no autorizado'
        })
    }

     //en caso de que exista el token, hay que verificarlo
     const decoded =  jwt.verify(token , config.secret);
     req.usuarioId = decoded.id; //como vamos a utilizarlo en distintas rutas lo guardo en req, que lo tienen todos los middlewares
     next(); //uso next porque lo vamos a utilizar en funciones intermedias
}

module.exports = verifyToken;
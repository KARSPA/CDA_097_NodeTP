
const jwt = require('jsonwebtoken');

const JWT_SECRET = "baguette."

const responseService = require('../shared/responseService');

module.exports = (req,res,next)=>{
    try{
        const token = req.header("authorization").split(" ")[1];
        if(!token) return responseService(res, "403", "Accès refusé", null);

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }catch{
        return responseService(res, "400", "Token invalide", null);
    }
}
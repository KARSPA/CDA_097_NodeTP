
const responseService = require('../shared/responseService');

const jwt = require('jsonwebtoken');
const JWT_SECRET = "baguette."
const bcrypt = require('bcrypt');

const generateAccessToken = require('../shared/helpers');

const usersPromise = require('../bouchon/users');

async function setupAuthRoutes(app){

    //On créer les utilisateurs présent dans la classe bouchon (ce seront ceux de base au lancement du serveur).
    const users = await usersPromise;

    app.post('/login', async (req, res) => {

        //Authentifier l'utilisateur avec mdp et username ...
        const user = users.find(user => user.username == req.body.username);
        if(!user){ //Si user null
            return responseService(res, "701", "Cet username n'existe pas.", null);
        }
        try{
            if(!(await bcrypt.compare(req.body.password, user.password))){
                return responseService(res, "701", "Mauvais mot de passe, veuillez réessayer.", null);
            }
        }catch{
            return responseService(res, "500", "Erreur lors du déchiffrement du mot de passe", null);
        }

        //Si ok, créer le token ...
        const duration = 3600;
        const token = jwt.sign(user, JWT_SECRET, {expiresIn : `${duration}s`});
        
        return responseService(res, "200", "Access Token créer avec succès.", {accessToken : token, expiresIn : duration });

    })

    app.post('/users', async (req, res) =>{
        try{
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const user = {username : req.body.username, password : hashedPassword};
            users.push(user);

            return responseService(res,"200", "Utilisateur créer avec succès.", user);
            
        }catch{
            return responseService(res, "500", "Erreur lors du chiffrement du mot de passe", null);
        }

    })


}


module.exports = setupAuthRoutes;
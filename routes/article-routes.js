let osef = require('../bouchon/articles');

const mongoose = require('mongoose');
const {v4 : uuidv4} = require('uuid');

const Article = require('../mongoose/models/mongoose-article');

const checkTitleAdd = require('../shared/helpers');
const checkTitleModify = require('../shared/helpers');
const checkUID = require('../shared/helpers');

const responseService = require('../shared/responseService');
const auth = require('../shared/middlewares');


function setupArticleRoutes(app){

    app.get('/articles', async (req, res) => {

        const articles = await Article.find();

        return responseService(res, "200", "La liste des articles a été récupérées avec succès.", articles);
        
    });
    
    app.get('/article/:articleId', async (req, res) => {

        const articleId = req.params.articleId

        const foundArticle = await Article.findOne({uid : articleId});

        if(!foundArticle){
            return responseService(res, "702", `Aucun article trouvé avec cet identifiant !`, null);
        }

        return responseService(res, "200", "Article récupéré avec succès.", foundArticle);

    });
    
    app.post('/save-article',auth, async (req, res) => {

        //Récup l'article envoyé en JSON
        const articleJSON = req.body;
        
        if(Object.keys(articleJSON).length==0){// Si article vide
            return responseService(res, "701", "Impossible d'ajouter un article vide", null);
        }

        if(!articleJSON.uid){ //Si pas de champ uid dans articleJSON, alors c'est qu'on créer un article
            let isTitleOk = await checkTitleAdd(articleJSON);

            articleJSON.uid = uuidv4();
    
            if(!isTitleOk){
                return responseService(res, "701", "Impossible d'ajouter un article avec un titre déjà existant.", null);
            }
    
            const createdArticle = await Article.create(articleJSON);

            return responseService(res, "200", "Article ajouté avec succès.", createdArticle);

        }else{ // Sinon c'est qu'il y a un champ uid dans articleJSON, donc on modifie
            let isUIDOk = await checkUID(articleJSON);
            let isTitleOk = await checkTitleModify(articleJSON);

            if(!isUIDOk){
                return responseService(res, "702", "Impossible de modifier un article dont l'id n'existe pas.", null);
            }

            if(!isTitleOk){
                return responseService(res, "701", "Impossible de modifier un article si un autre article possède le titre choisi.", null);
            }

            await Article.findOneAndUpdate({uid : articleJSON.uid}, articleJSON);

            return responseService(res, "200", "Article modifié avec succès.", articleJSON);
        }
    });

    
    app.delete('/article/:articleId', auth, async (req, res) => {

        const articleId = req.params.articleId;

        const articleToDelete = await Article.findOneAndDelete({uid : articleId});

        if(!articleToDelete){
            return responseService(res, "702", "Impossible de supprimé un article dont l'id n'existe pas.", null);
        }

        return responseService(res, "200", "Article supprimé avec succès.", articleToDelete);

    });
}


module.exports = setupArticleRoutes;
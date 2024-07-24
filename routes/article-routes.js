let osef = require('../bouchon/articles');

const mongoose = require('mongoose');
const {v4 : uuidv4} = require('uuid');

const Article = require('../mongoose/models/mongoose-article');

const checkTitle = require('../shared/helpers');
const checkUID = require('../shared/helpers');

function setupRoutes(app){

    app.get('/articles', async (req, res) => {

        const articles = await Article.find();

        return res.json({
            code : "200",
            message : "La liste des articles a été récupérées avec succès.",
            data : articles
        });
    });
    
    app.get('/article/:articleId', async (req, res) => {

        const articleId = req.params.articleId

        const foundArticle = await Article.findOne({uid : articleId});

        if(!foundArticle){
            return res.json({
                code : "702",
                message : `Aucun article trouvé avec cet identifiant !`,
                data : null
            })
        }

        return res.json({
            code : "200",
            message : "Article récupéré avec succès.",
            data : foundArticle
        });

    });
    
    app.post('/save-article', async (req, res) => {

        //Récup l'article envoyé en JSON
        const articleJSON = req.body;
        let isTitleOk = await checkTitle(articleJSON);

        if(Object.keys(articleJSON).length==0){// Si article vide
            return res.json({
                code : "701",
                message : "Impossible d'ajouter un article vide",
                data : null
            });
        }

        if(!articleJSON.uid){ //Si pas de champ uid dans articleJSON, alors c'est qu'on créer un article
            
            articleJSON.uid = uuidv4();
    
            if(!isTitleOk){
                return res.json({
                    code : "701",
                    message : "Impossible d'ajouter un article avec un titre déjà existant.",
                    data : null
                });
            }
    
            const createdArticle = await Article.create(articleJSON);
            
            return res.json({
                code : "200",
                message : "Article ajouté avec succès.",
                data : createdArticle
            });

        }else{ // Sinon c'est qu'il y a un champ uid dans articleJSON, donc on modifie
            let isUIDOk = await checkUID(articleJSON);

            if(!isUIDOk){
                return res.json({
                    code : "702",
                    message : "Impossible de modifier un article dont l'id n'existe pas.",
                    data : null
                });
            }

            if(!isTitleOk){
                return res.json({
                    code : "701",
                    message : "Impossible de modifier un article si un autre article possède le titre choisi. ",
                    data : null
                });
            }

            const modifiedArticle = await Article.updateOne(articleJSON);

            return res.json({
                code : "200",
                message : "Article modifié avec succès.",
                data : articleJSON
            });
        }
    });

    
    app.delete('/article/:articleId', async (req, res) => {

        const articleId = req.params.articleId;

        const articleToDelete = await Article.findOneAndDelete({uid : articleId});

        if(!articleToDelete){
            return res.json({
                code : "702",
                message : "Impossible de supprimé un article dont l'id n'existe pas.",
                data : null
            });
        }

        return res.json({
            code : "200",
            message : "Article supprimé avec succès.",
            data : articleToDelete
        });
    });
}


module.exports = setupRoutes;
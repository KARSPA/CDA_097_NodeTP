let articles = require('../bouchon/articles');

function setupRoutes(app){

    app.get('/articles', (req, res) => {
        return res.json(articles)
    });
    
    app.get('/article/:articleId', (req, res) => {
        //res.send(`Retournera l'article ayant l'id ${req.params.articleId}`)
        
        const id = parseInt(req.params.articleId)

        const foundArticle = articles.find(article => article.id === id);

        return res.json(foundArticle);

        /* MA VERSION
        const articleId = req.params.articleId;
        let article = articles.filter(article => article.id == articleId);
        
        res.json({article : article});
        */
    });
    
    app.post('/save-article', function (req, res) {
        //res.send('Va créer/mettre à jour un article envoyé')


        //Récup l'article envoyé en JSON
        const articleJSON = req.body;

        let foundArticle = null;
        if(articleJSON.id != undefined || articleJSON.id){ //Si l'articleJSON possède un id.

            //Essayer de trouver un article existant
            foundArticle = articles.find(article => article.id === articleJSON.id);

        }

        //Si je trouve, modifier
        if(foundArticle){
            for (let property in foundArticle) {
                foundArticle[property] = articleJSON[property];
            }
            return res.json(`L'article avec l'id ${foundArticle.id} a était modifié avec succès.`);
        }

        //Sinon par défaut j'ajoute l'article au tableau. (attention pour l'instant sans id)
        articles.push(articleJSON);

        return res.json(`Article créer avec succès`)

        /* MA VERSION
        let articleId = req.body.id;
        let article = req.body;
        
        if(articleId > articles.length){
            articles.push(article);
            res.send(`L'article avec l'id ${articleId} a était créer avec succès.`)
        }else{
            articles[articleId-1] = article;
            res.send(`L'article avec l'id ${articleId} a était mis à jour avec succès.`)
        }
        */
    });
    
    app.delete('/article/:articleId', function(req, res) {
        const articleId  = parseInt(req.params.articleId);

        const foundArticleIndex = articles.findIndex(article => article.id === articleId)

        if(foundArticleIndex == -1){
            return res.json("Article non trouvé.");
        }

        articles.splice(foundArticleIndex, 1);
        return res.json(`Article avec l'id ${articleId} supprimé avec succès.`)


        /* MA VERSION
        if(articles.find(article => article.id == articleId)==undefined){
            res.json({message : "Article non trouvé."})
        }else{
            articles = articles.findIndex(article => article.id != articleId)
            res.json({message : `Article avec l'id ${articleId} supprimé avec succès.`})
        }
        */
    });

}

module.exports = setupRoutes;
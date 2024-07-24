let osef = require('../bouchon/articles');

const mongoose = require('mongoose');
const {v4 : uuidv4} = require('uuid');


function setupRoutes(app){

    mongoose.connection.once('open', ()=>{
        console.log("Connecté à la BDD");
    });
    mongoose.connection.on('error', (err)=>{
        console.log(`Erreur de la BDD : ${err}`);
    })
    mongoose.connect("mongodb://localhost:27017/db_articles");
    

    const Article = mongoose.model('Article', {uid: String, title: String, content: String, author: String }, 'articles');


    app.get('/articles', async (req, res) => {

        const articles = await Article.find();

        return res.json(articles);
    });
    
    app.get('/article/:articleId', async (req, res) => {

        const articleId = req.params.articleId

        const foundArticle = await Article.findOne({uid : articleId});

        if(!foundArticle){
            return res.json({message : `Aucun article trouvé avec cet identifiant !`})
        }

        return res.json(foundArticle);

    });
    
    app.post('/save-article', async (req, res) => {

        //Récup l'article envoyé en JSON
        const articleJSON = req.body;

        articleJSON.uid = uuidv4();

        const createdArticle = await Article.create(articleJSON);
        
        return res.json(createdArticle);

    });

    
    app.delete('/article/:articleId', async (req, res) => {

        const articleId = req.params.articleId;

        const deletedArticle = await Article.findOneAndDelete({uid : articleId});

        if(!deletedArticle){
            return res.json({message : `Aucun article avec cet identifiant trouvé, suppression impossible !`})
        }

        return res.json({message : `Article supprimé avec succès.`});

    });

}

module.exports = setupRoutes;
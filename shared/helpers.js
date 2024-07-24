const mongoose = require('mongoose');
const Article = require('../mongoose/models/mongoose-article');



async function checkTitle(article){
    
    if(article!=undefined && article.title){
        const checkArticle = await Article.findOne({title : article.title});

        if(checkArticle){ // Si checkArticle n'est pas null, alors il existe déjà un article avec ce titre.
            return false;
        }
        return true;

    }
    return true;
}

async function checkUID(article){

    if(article!=undefined && article.uid){
        const checkArticle = await Article.findOne({uid : article.uid});

        if(checkArticle){ // Si checkArticle n'est pas null, alors il existe déjà un article avec cet uid, on peut donc modifier.
            return true;
        }
        return false;

    }
    return true;
}

module.exports = checkTitle;
module.exports = checkUID;
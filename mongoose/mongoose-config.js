const mongoose = require('mongoose');

async function connectToDB(){

    mongoose.connection.once('open', ()=>{
        console.log("Connecté à la BDD");
    });
    mongoose.connection.on('error', (err)=>{
        console.log(`Erreur de la BDD : ${err}`);
    })
    mongoose.connect("mongodb://localhost:27017/db_articles");

}

module.exports = connectToDB;
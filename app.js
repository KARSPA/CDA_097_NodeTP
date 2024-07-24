const express = require('express');
const app = express();
const port = 3000;
//Autorise express à recevoir des données envoyées en JSON dans le body
app.use(express.json());
const setupArticlesRoutes = require('./routes/article-routes');
const connectToDB = require('./mongoose/mongoose-config');

connectToDB();

setupArticlesRoutes(app);


app.listen(port, ()=>{
    console.log(`Écoute sur le port ${port}`);
})
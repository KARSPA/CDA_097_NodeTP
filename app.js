const express = require('express');
const app = express();
const port = 3000;
//Autorise express à recevoir des données envoyées en JSON dans le body
app.use(express.json());
const setupArticleRoutes = require('./routes/article-routes');
const setupAuthRoutes = require('./routes/auth-routes');
const connectToDB = require('./mongoose/mongoose-config');

connectToDB();

setupAuthRoutes(app);
setupArticleRoutes(app);


app.listen(port, ()=>{
    console.log(`Écoute sur le port ${port}`);
})
const mongoose = require('mongoose');
const Article = mongoose.model('Article', {uid: String, title: String, content: String, author: String }, 'articles');

module.exports = Article;
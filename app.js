const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const IP = 3000;

mongoose.connect('mongodb://localhost/nodekb');     // Verbindung zur MongoDB aufbauen
let db = mongoose.connection;

// Check connection
db.once('open', function(){
    console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function(err){
    console.log(err);
});


// Init App
const app = express();


// Bring in Models
let Article = require('./models/article');


// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));


// Home Route
app.get('/', function(req, res) {
    Article.find({}, function(err, articles) {  // leeres query, weil alle Artikel der Datenbank gefunden werden sollen, response = articles
        if(err) {
            console.log(err) 
        } else {
            res.render('index', {                   // Template index.pug rendern
                title: 'Artikel',
                articles: articles                  // Artikel von Query zur View weitergegeben
            });
        }
    });

    // Get Single Article Route
    app.get('/article/:id',function(req, res){      // : bedeutet Platzhalter
        Article.findById(req.params.id, function(err, article) { // Wieder Model benutzen
            if (err) {
                console.log(err)
            } else {
                res.render('article', {             // Template article.pug rendern
                    article: article
                });
            }
        });
    });


/*
    let articles = [                            // statisch erzeugtes Objekt, ohne MongoDB
        {
            id:1,
            title: 'Artikel eins',
            author: 'Andre',
            body: 'Ich bin Artikel eins',
        },
        {
            id:2,
            title: 'Artikel zwei',
            author: 'Marcel',
            body: 'Ich bin Artikel zwei',
        },
        {
            id:2,
            title: 'Artikel drei',
            author: 'Sandra',
            body: 'Ich bin Artikel drei',
        },
    ];
*/
    
});

// Add Route
app.get('/articles/add', function(req, res) {
    res.render('add_article', {
        title: 'Add Article'
    })
});

//Add Submit POST Route
app.post('/articles/add', function(req, res){       // Artikel zum Server posten (submitten)
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
    article.save(function(err){
        if(err){
            console.log(err);
            return;
        } else {
            res.redirect('/');                  // Nach Submit, zurueck zur Homepage
        }
    });                 
});

// Load Edit Form Route
app.get('/article/edit/:id',function(req, res){
    Article.findById(req.params.id,function(err, article) {
        res.render('edit_article', {
            title:'Edit Article',
            article: article
        });
    });
});

// Update Submit Post Route
app.post('/articles/edit/:id', function(req, res) {         // Zum Server posten
    let article = {};                                       // Objekt wird durch Felder im Formular gefüllt
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
    let query = {_id:req.params.id}
    Article.update(query, article, function(err) {
        if(err){
            console.log(err);
            return;
        } else {
            res.redirect('/');                  // Nach Submit, zurueck zur Homepage
        }
    });                 
});

// Delete Article
app.delete('/article/:id', function(req, res) {     // Loescht die Url des Artikels
    let query = {_id:req.params.id} 
    Article.remove(query, function(err) {           // Loescht Artikel aus Datenbank
        if(err){
            console.log(err);
        }
        res.send('Success');        // Da Request von main.js, muss eine response gesendet werden
                                    // Es wird default-Wert 200 OK zum Client zurueckgeschickt
    });
});

// Start Server
app.listen(IP, function() {
    console.log('server started on port', + IP);
    return;
});
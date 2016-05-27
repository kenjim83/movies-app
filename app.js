var express = require('express');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
var nunjucks = require('nunjucks');

nunjucks.configure('views', {
  autoescape: true,
  express: app
})
app.set('view engine', 'html');


MongoClient.connect('mongodb://localhost:27017/video', function(err, db){
  app.get('/', function(req, res){
    db.collection('movies').find({}).toArray(function(err, movies){
      if(err) { throw err; }
      console.log(movies)
      res.render('movies', { movies: movies });
    });
  });

  app.post('/movies/create', function(req, res){
    if(req.body.title  && req.body.year){
      db.collection('movies').insert({
        title: req.body.title,
        year: req.body.year,
        imdb: req.body.imdb
      });
    }

    res.redirect('/');
  });

  // Error handling
  app.use(function(req, res){
    res.sendStatus(404);
  })

  var server = app.listen(3000, function(){
    var port = server.address().port;
    console.log("Listening on http://localhost:" + port);
  })
});

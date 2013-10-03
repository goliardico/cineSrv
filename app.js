var express = require ('express');
var app = express();

var scrape = require('./scrape');


// Produce il Json dei film in programmazione.
// func: è generato dal client per proteggere dal CSS (vedi JSONP)
// La chiamata da jQuery a questo servizio deve essere ($.getJSON):
// http://<server>:3000/trovafilm?jsoncallback=?
app.get ('/trovafilm', function(req, res) {
   console.log('Ricevuta richiesta con func=' + req.query['jsoncallback']);
   scrape.trovaFilm( function(film) {
      res.send(film);
   }, req.query['jsoncallback']);
});


app.listen(3000);
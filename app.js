var express = require ('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.set('port', (process.env.PORT || 5000));


var scrape = require('./scrape');

// Produce il Json dei film in programmazione.
// func: è generato dal client per proteggere dal CSS (vedi JSONP)
// La chiamata da jQuery a questo servizio deve essere ($.getJSON):
// http://<server>:3000/trovafilm?jsoncallback=?
app.get ('/all', function(req, res) {

   scrape.trovaFilm( function(data) {

      // Deve tornare una stringa (Json),
      // se torna un numero c'è stato un problema
      if ( data !== 0  ) {
         // OK: restituisco la lista film in Json
         res.status(200).jsonp(data);

      } else {
         // ERR: restituisco HTTP code 404
         res.status(404).jsonp(data);

      }
   });
});


// restituisce i dettagli del film (id - una url) passato come parametro
// In formato JSONP
// http://<server>:3000/film?id=?
app.get ('/film', function(req, res) {

   scrape.film( function(data) {
      if ( data !== 0  ) {
         // OK: restituisco i dati in Jsonp
         res.status(200).jsonp(data);

      } else {
         // ERR: restituisco HTTP code 404
         res.status(404).jsonp(data);

      }
   }, req.query.id);
});


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

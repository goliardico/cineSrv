var express = require ('express');
var app = express();

var scrape = require('./scrape');
var db = require('./db');

// Produce il Json dei film in programmazione.
// func: è generato dal client per proteggere dal CSS (vedi JSONP)
// La chiamata da jQuery a questo servizio deve essere ($.getJSON):
// http://<server>:3000/trovafilm?jsoncallback=?
app.get ('/trovafilm', function(req, res) {
   console.log('[trovafilm] func=' + req.query['jsoncallback']);
   scrape.trovaFilm( function(film) {
      res.send(film);
   }, req.query['jsoncallback']);
});


// Cerca all'interno del database l'esistenza di una precedente
// registrazione per il telefono con uuid passato nella get
// La richiesta dovrà essere:
// http://<server>:3000/rubrica?uuid=?
app.get ('/rubrica', function(req, res) {
   db.rubrica( function(nome) {
      res.send(nome);
   }, 'get', req.query['uuid']);
});

// Inserisce un nuovo nome in rubrica
// due parametri: nome e uuid
// http://<server>:3000/rubrica?uuid=?&nome=?
// restituisce:
// ok : per inserimento corretto
// nok: per errore
app.put ('/rubrica', function(req, res) {
   db.rubrica( function(risultato) {
      res.send(risultato);
   }, 'put', req.query['uuid'], req.query['nome']);
});



app.listen(3000);
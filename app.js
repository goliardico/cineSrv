var express = require ('express');
var app = express();

var scrape = require('./scrape');
var db = require('./db');

// Produce il Json dei film in programmazione.
// func: è generato dal client per proteggere dal CSS (vedi JSONP)
// La chiamata da jQuery a questo servizio deve essere ($.getJSON):
// http://<server>:3000/trovafilm?jsoncallback=?
app.get ('/trovafilm', function(req, res) {

   res.type('application/json');
   app.set('jsonp callback name', 'jsoncallback');
   console.log('GET received: ' + req.query.jsoncallback);

   scrape.trovaFilm( function(data) {

      // Deve tornare una stringa (Json),
      // se torna un numero c'è stato un problema
      if ( data !== 0  ) {
         // OK: restituisco la lista film in Json
         res.jsonp(200, data);

      } else {
         // ERR: restituisco HTTP code 404
         res.jsonp(404, data);

      }
   });
});


// restituisce i dettagli del film (id) passato come parametro
// http://<server>:3000/film?id=?
app.get ('/film', function(req, res) {

   scrape.film( function(data) {
      res.send(data);
   }, 'get', req.query.id);
});


// Cerca all'interno del database l'esistenza di una precedente
// registrazione per il telefono con uuid passato nella get
// La richiesta dovrà essere:
// http://<server>:3000/rubrica?uuid=?
app.get ('/rubrica', function(req, res) {
   db.rubrica( function(nome) {
      res.send(nome);
   }, 'get', req.query.uuid);
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
   }, 'put', req.query.uuid, req.query.nome);
});



app.listen(3000);

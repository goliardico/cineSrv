var request = require ('request');
var cheerio = require ('cheerio');


function trovaFilm(callback, func) {
var url = 'http://trovacinema.repubblica.it/programmazione-cinema/citta/roma/rm/film';

request(url, function(err, resp, body) {
  if ( err || resp.statusCode != 200 ) {
    console.log('Something goes wrong on GET '+url+' resp: '+resp);
  }

  var films = new Array;
  $ = cheerio.load(body);

// L'elenco film e programmazione è costruito con il seguente schema:
// <div class="searchRes-group">
//           <div class="labelSearchFilm">
//                  <a class="filmName" href="..">nome del film</a>
//           <div class="resultLineFilm">
//                  <div class="div-center">
//                        <p class="cineName">sala</p>
//                  <div class="div-right">
//                        <span class="res-hours">orari</span>

  $('.searchRes-group').each(function(i, elem) {
    var filmTemp = new Object;
    filmTemp.when = new Array;

    var filmName = $(elem).find('.filmName'); // Titolo del film
    filmTemp.film = $(filmName).text();
    // console.log('Titolo: ' + $(filmName).text());
    
    var when = $(elem).find('.resultLineFilm');
    $(when).each(function(i, cinema) {
       var cineName = $(cinema).find('.cineName');  // nome della sala
       var when = $(cinema).find('.res-hours');     // orario di programmazione

       filmTemp.when.push({cine: $(cineName).text(), when: $(when).text()});
  
       //console.log('Sala: ' + $(cineName).text() + ' ' + $(when).text());
    });

  if ( filmTemp.when.length > 0 )  // inserisco il film solo se ci sono sale
    films.push(filmTemp);
  });

  //console.log(JSON.stringify(films, null, 4));
  callback(func + '(' + JSON.stringify(films, null, 4) + ')');
});

// Json output:
// {
//    "film": "string",
//    "when": [
//        {"cine": "string", "hour": "string"},
//        {"cine": "string", "hour": "string"},
//    ]
// }

};

exports.trovaFilm = trovaFilm;

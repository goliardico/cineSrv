var request = require ('request');
var cheerio = require ('cheerio');


function trovaFilm(callback) {

var url = 'http://trovacinema.repubblica.it/programmazione-cinema/citta/roma/rm/film';
var films = new Array;

request(url, function(err, resp, body) {
  if ( err || resp.statusCode != 200 ) {
    console.log('[trovafilm] Something goes wrong on GET remote: '+resp);
    films = [0];
  } else {

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
      
      var when = $(elem).find('.resultLineFilm');
      $(when).each(function(i, cinema) {
         var cineName = $(cinema).find('.cineName').text();  // nome della sala
         cineName = capitalize(cineName.toLowerCase());
         var when = $(cinema).find('.res-hours');     // orario di programmazione

         filmTemp.when.push({cine: cineName, when: $(when).text()});
    
         console.log('Sala: ' + cineName + ' ' + $(when).text());
      });

    if ( filmTemp.when.length > 0 )  // inserisco il film solo se ci sono sale
      films.push(filmTemp);
    });
  }
  
  callback(films);
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


function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

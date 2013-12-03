var request = require ('request');
var cheerio = require ('cheerio');

// Json output:
// {
//    "film": "string",
//    "when": [
//        {"cine": "string", "hour": "string"},
//        {"cine": "string", "hour": "string"},
//    ]
// }
function trovaFilm(callback) {

var baseUrl = 'http://trovacinema.repubblica.it';
var url = baseUrl + '/programmazione-cinema/citta/roma/rm/film';
var films = [];

  request(url, function(err, resp, body) {
    if ( err || resp.statusCode != 200 ) {
      console.log('[trovafilm] Something goes wrong on GET remote: ' + resp);
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
        var filmTemp = {};
        filmTemp.when = [];

        var filmName = $(elem).find('.filmName');
        filmTemp.film = $(filmName).text();        // Titolo del film
        filmTemp.url = $(filmName).attr('href');   // Url con info

        var when = $(elem).find('.resultLineFilm');
        $(when).each(function(i, cinema) {
           var cineName = $(cinema).find('.cineName').text();  // nome della sala
           cineName = capitalize(cineName.toLowerCase());
           var when = $(cinema).find('.res-hours');     // orario di programmazione

           filmTemp.when.push({cine: cineName, when: $(when).text()});
        });

      if ( filmTemp.when.length > 0 ) {  // inserisco il film solo se ci sono sale
          films.push(filmTemp);
      }

      }); // fine ciclo su ogni film presente
    }

    console.log('[trovaFilm] finito! films.lenght : ' + films.lenght);
    callback(films);
  });
}

exports.trovaFilm = trovaFilm;




// scarica i dettagli di un film (regia, attori, anno)
function film(url, callback) {

  var details = '-';
  request(url, function(err, resp, body) {
    if ( err || resp.statusCode != 200 ) {
      console.log('[trovafilm] Something goes wrong on GET remote: '+resp);
    } else {
      pageDetail = cheerio.load(body);
      details = pageDetail('.tecInfo').text();
    }

    callback(details);
  });

}


exports.film = film;


function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
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

        var filmName = $(elem).find('.filmName');
        filmTemp.film = $(filmName).text();        // Titolo del film
        filmTemp.url = $(filmName).attr('href');   // Url con info
        console.log('url: ' + filmTemp.url);

        var when = $(elem).find('.resultLineFilm');
        $(when).each(function(i, cinema) {
           var cineName = $(cinema).find('.cineName').text();  // nome della sala
           cineName = capitalize(cineName.toLowerCase());
           var when = $(cinema).find('.res-hours');     // orario di programmazione

           filmTemp.when.push({cine: cineName, when: $(when).text()});
        });

      if ( filmTemp.when.length > 0 )  // inserisco il film solo se ci sono sale
        films.push(filmTemp);
      });
    }

    var filmDetails = [];
    filmDetails = downThemAll(films);

    callback(films);
  });
};

exports.trovaFilm = trovaFilm;

function downThemAll(films) {
  var details = [];

  for (i = 0; i < films.length; i++) {
    console.log('request: ' + films[i].url);
  };

  return details;
};


function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

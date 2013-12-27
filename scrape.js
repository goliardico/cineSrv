var request = require ('request');
var cheerio = require ('cheerio');
var Iconv = require('iconv').Iconv;

var baseUrl = 'http://trovacinema.repubblica.it';


// Restituisce (in JSONP), l'elenco dei film a Roma, la presenza di cineclub e versioni in
// lingua originale
function trovaFilm(callback) {

var urlLink = baseUrl + '/programmazione-cinema/citta/roma/rm/film';
var films = [];

var options = {
    url: urlLink,
    encoding: 'binary',
};

  request(options, function(err, resp, body) {
    if ( err || resp.statusCode != 200 ) {
      console.log('[trovafilm] Something goes wrong on GET remote: ' + resp);
      films = [0];
    } else {

      body = new Buffer(body, 'binary');
      var iconv = new Iconv('latin1', 'utf8');

      body = iconv.convert(body).toString('utf8');
      $ = cheerio.load(body);

      $('.searchRes-group').each(function(i, elem) {
        var filmTemp = {};
        filmTemp.when = [];

        var filmName = $(elem).find('.filmName');
        filmTemp.film = $(filmName).text(); // Titolo del film
        filmTemp.vo = 0; // Film in lingua originale [0: no; 1: si]
        filmTemp.amici = 0; // Film proiettati in cineclub [0: no; 1: si]
        filmTemp.url = $(filmName).attr('href');   // Url con info

        var when = $(elem).find('.resultLineFilm');
        $(when).each(function(i, cinema) {
           var cineName = $(cinema).find('.cineName').text();  // nome della sala
           cineName = capitalize(cineName.toLowerCase());
           var when = $(cinema).find('.res-hours').text();     // orario di programmazione

           // Lingua originale
           var vo = 0;
           if ( when.indexOf('Lingua originale') > -1 ) {
              vo = 1;
              filmTemp.vo = 1;
              when = when.replace('Lingua originale','').trim();
           }

           // Cineclub
           var amici = 0;
           if ( ( cineName.indexOf('Detour') > -1 ) || ( cineName.indexOf('Kino') > -1 ) ||
                ( cineName.indexOf('Alphaville') > -1 ) || ( cineName.indexOf('Cineclub') > -1 ) ) {
              amici = 1;
              filmTemp.amici = 1;
           }

           filmTemp.when.push({cine: cineName, when: when, cineVo: vo, cineAmici: amici});
        });

      if ( filmTemp.when.length > 0 ) {  // inserisco il film solo se ci sono sale
          films.push(filmTemp);
      }

      }); // fine ciclo su ogni film presente
    }

    callback(films);
  });
}

exports.trovaFilm = trovaFilm;




// scarica i dettagli di un film (regia, attori, anno)
function film(callback, url) {

  var urlLink = baseUrl + '/' + url;
  var details = {};
  request(urlLink, function(err, resp, body) {
    if ( err || resp.statusCode != 200 ) {
      console.log('[scrape.film] Something goes wrong on GET remote: '+resp);
    } else {

      body = new Buffer(body, 'binary');
      var iconv = new Iconv('latin1', 'utf8');

      body = iconv.convert(body).toString('utf8');
      pageDetail = cheerio.load(body);
      var detailsDirty = pageDetail('.tecInfo').text();
      detailsDirty = detailsDirty.replace(/\s\s/g, "");
      detailsDirty = detailsDirty.replace(/Con:/, " Con: ");
      detailsDirty = detailsDirty.replace(/Anno:/, " Anno: ");
      details.all = detailsDirty.replace(/\r\n/g, "").trim();

      // estrae:
      //   - regia
      //   - attori
      //   - anno
      var regRegia  = /Regia:\s(.+)\sCon:/;
      var regAttori = /Con:\s(.+)\sAnno:/;
      var regAnno   = /Anno:\s(\d+)/;

      var regia  = regRegia.exec(details.all);
      var attori = regAttori.exec(details.all);
      var anno   = regAnno.exec(details.all);

      // Could be NULL, check on frontend
      if ( regia !== null )
        details.regia  = regia[1];
      if ( attori !== null )
        details.attori = attori[1];
      if ( anno !== null )
        details.anno   = anno[1];
    }

    callback(details);
  });

}

exports.film = film;


function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

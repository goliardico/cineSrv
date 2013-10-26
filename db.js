var mongoose = require('mongoose');

var usersSchema = mongoose.Schema({
   nome: String,
   uuid: String
});

var favsSchema = mongoose.Schema({
	film: String,
	cinema: String,
	orario: String,
	preferenze: Array
});

function handleError(error) {
   console.log('Something wrong: ' + err);
   callback('error');
};

// CRUD sulla rubrica dei nomi / uuid registrati
function rubrica(callback, req, uuid, nome) {

   mongoose.connect('mongodb://localhost/cinesrv');
   var db = mongoose.connection;

   // associa lo schema alla collection all'interno del database
   var usersModel = db.model('users', usersSchema);
   // crea un documento in base allo schema (collection) del database
   var users = new usersModel();

   db.on('error', console.error.bind(console, 'connection error:'));
   db.once('open', function () {

      switch (req) {
         case 'get':
            console.log('[rubrica-get] search for: ' + uuid);
            usersModel.findOne({ 'uuid': uuid }, 'nome', function (err, result) {
               if (err) return handleError(err);
               console.log('[rubrica-get] nome: ' + result.nome);
               db.close();
               callback(result.nome);
            });
         break;
         case 'put':
            console.log('[rubrica-put] insert: ' + nome);
            users.nome = nome;
            users.uuid = uuid;
            users.save(function (err, users) {
               if (err) return handleError(err);
               console.log('[rubrica-put] salvato: ' + nome);
               db.close();
               callback('ok');
            });
         break;
      };
   });
};

exports.rubrica = rubrica;
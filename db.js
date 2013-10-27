var mongoose = require('mongoose');
var db = undefined; // connection handler

var usersSchema = mongoose.Schema({
   nome: { type: String, required: true, trim: true },
   uuid: { type: String, required: true, trim: true }
});

var favsSchema = mongoose.Schema({
	film: { type: String, required: true, trim: true },
	cinema: { type: String, required: true, trim: true },
	orario: { type: String, required: true, trim: true },
	preferenze: Array
});

function handleError(error) {
   console.log('Something wrong: ' + err);
   callback('error');
};

// CRUD sulla rubrica dei nomi / uuid registrati
function rubrica(callback, req, uuid, nome) {

   console.log('mongoose connection state: ' + mongoose.connection.readyState);
   if ( mongoose.connection.readyState == 0 ) {
      mongoose.connect('mongodb://localhost/cinesrv');
      db = mongoose.connection;
   };

   // associa lo schema alla collection all'interno del database
   var usersModel = db.model('users', usersSchema);
   // crea un documento in base allo schema (collection) del database
   var users = new usersModel();

   db.on('error', console.error.bind(console, 'connection error:'));
   
   if ( mongoose.connection.readyState ) {
      switch (req) {
         case 'get':
            usersModel.findOne({ 'uuid': uuid }, 'nome', function (err, result) {
               if (err) return handleError(err);
               console.log('[rubrica-get] nome: ' + result.nome);
               callback(result.nome);
            });
         break;
         case 'put':
            users.nome = nome;
            users.uuid = uuid;
            users.save(function (err, users) {
               if (err) return handleError(err);
               console.log('[rubrica-put] salvato: ' + nome);
               callback('ok');
            });
         break;
      };
   };
};

exports.rubrica = rubrica;